import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";
import { LogBox } from 'react-native';
import firebase from 'firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

LogBox.ignoreLogs(['Warning: ...']);
WebBrowser.maybeCompleteAuthSession();

const UserProfile = (props) => {
    const [profile, setProfile] = useState(null);
    const [fetched, setFetched] = useState(false);
    const [numPast, setNumPast] = useState('');

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '92611639381-kn3mlc4do2rev1gmndm6tqir7823hinc.apps.googleusercontent.com',
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#FFF"
        },
        text: {
            fontFamily: "HelveticaNeue",
            color: "#52575D"
        },
        image: {
            flex: 1,
            height: undefined,
            width: undefined
        },
        titleBar: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
            marginHorizontal: 16,
            marginLeft: 390
        },
        subText: {
            fontSize: 12,
            color: "#AEB5BC",
            textTransform: "uppercase",
            fontWeight: "500"
        },
        profileImage: {
            width: 200,
            height: 200,
            borderRadius: 100,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#000000"
        },
        edit: {
            backgroundColor: "#FFFFFF",
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#000000"
        },
        infoContainer: {
            alignSelf: "center",
            alignItems: "center",
            marginTop: 16
        },
        statsContainer: {
            flexDirection: "row",
            alignSelf: "center",
            marginTop: 32
        },
        statsBox: {
            alignItems: "center",
            flex: 1
        }
        
      });

    

    const linkGoogle = async () => {
        let { id_token } = response.params;
        const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
        let firebase_cred = await firebase
            .auth()
            .signInWithCredential(credential)
        let uid = firebase_cred.user.uid;
        let uri = `https://bussin.blakekjohnson.dev/api/google/link/${uid}`;
        let token = await AsyncStorage.getItem('@bussin-token');
        let google_res = await fetch(uri, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchProfile();
    };

    useEffect(() => {
        if (response?.type === 'success') {
            linkGoogle();
        }
    }, [response]);

    const fetchProfile = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');

        let res = await fetch("https://bussin.blakekjohnson.dev/api/user", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status != 200) {
            await AsyncStorage.removeItem('@bussin-token');
            props.navigation.reset({
                index: 0,
                routes: [
                    { name: 'Login' }
                ]
            });
            return;
        }

        let response = await fetch('https://bussin.blakekjohnson.dev/api/event/past', {
            headers: {
            'Authorization': `Bearer ${token}`,
        },
        });

        response = await response.json();

        setNumPast(response.events.length);

        let data = await res.json();

        setProfile(data.user);
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('@bussin-token');
        props.navigation.reset({
            index: 0,
            routes: [
                { name: 'Login' }
            ]
        });
    };

    const fetchWrapper = async () => {
        setFetched(false);
        await fetchProfile();
        setFetched(true);
    }

    useEffect(() => {
        props.navigation.addListener('focus', fetchWrapper);
    }, []);

    if (!fetched) {
    }

    // helper function to create a table to present the past events
    const createPastEventTable = async () => {
    let table = [];

    let children = [];
    // TODO: create function to put all the past events in the Profile
    // using fetchProfile
    var len = profile.pastEvent.length;
    //Inner loop to create children
    //only showcase the first 5 events
    // TODO: add name field to the pastEvent 
    for (let j = 0; j < len && j < 5; j++) {
      children.push(<td>{`${profile.pastEvent[j].name}`}
      <Button
            title="view event"
            onPress={findPastEvent}
          />
      </td>);
    }
    //Create the parent and add the children
    table.push(<tr>{children}</tr>);

    return table;
    };

    return (
    
      <SafeAreaView style={styles.container}>
        {profile && <>
          <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.titleBar}>
              </View>
              <View style={{ alignSelf: "center" }}>
                  <View style={styles.profileImage}>
                      <Image source={{ uri: profile.profilePhoto }} style={styles.image} resizeMode="center"></Image>
                  </View>
                  <View style={styles.edit}>
                      <Icon name="pencil" size={30} color="#B92126" style={{ marginTop: 4, marginLeft: 2 }} onPress = {() => props.navigation.navigate("Settings")}></Icon>
                  </View>
              </View>

              <View style={styles.infoContainer}>
                  <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{profile.name}</Text>
                  <Text style={[styles.text, { color: "#AEB5BC", fontSize: 20 }]}>{profile.username}</Text>
              </View>

              <View style={styles.statsContainer}>
                  <View style={styles.statsBox}>
                      <Text style={[styles.text, { fontSize: 24 }]}>{profile.eventPoints}</Text>
                      <Text style={[styles.text, styles.subText]}>Bussin Score</Text>
                  </View>
                  <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                      <Text style={[styles.text, { fontSize: 24 }]} onPress={() => props.navigation.navigate('PastEvent')}>{numPast}</Text>
                      <Text style={[styles.text, styles.subText]} onPress={() => props.navigation.navigate('PastEvent')} >Past Events</Text>
                  </View>
                  <View style={[styles.statsBox, {borderColor: "#DFD8C8", borderRightWidth: 1}]}>
                      <Text style={[styles.text, { fontSize: 24 }]} onPress={() => props.navigation.navigate('FriendList', {type: 'friends'})}>{profile.friends.length}</Text>
                      <Text style={[styles.text, styles.subText]} onPress={() => props.navigation.navigate('FriendList', {type: 'friends'})}>Friends</Text>
                  </View>
                  <View style={styles.statsBox}>
                      <Text style={[styles.text, { fontSize: 24 }]} onPress={() => props.navigation.navigate('OrgFollowing')}>{profile.organizations.length}</Text>
                      <Text style={[styles.text, styles.subText]} onPress={() => props.navigation.navigate('OrgFollowing')}>Organizations</Text>
                  </View>
              </View>

              <View style={styles.infoContainer}>
                    {
                        !profile.googleUID &&
                        <Button title="Link Google" disabled={!request} onPress={() => promptAsync()} />
                    }
                    {
                        !!profile.googleUID &&
                        <Button title="Google Account Linked" disabled={true} />
                    }
                    <Button title='Find Friends' onPress={() => props.navigation.navigate('FindFriends')} />
                    <Button title='Create an Organization' onPress={() => props.navigation.navigate('CreateOrg')} />
                    <Button title='Log Out' onPress={logOut} />
              </View>

          </ScrollView>
          </>
        }
      </SafeAreaView>
  );
}

export default UserProfile;