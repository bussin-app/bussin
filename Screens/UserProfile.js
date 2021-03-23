import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

const UserProfile = (props) => {
    const [profile, setProfile] = useState(null);
    const [fetched, setFetched] = useState(false);


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
          overflow: "hidden"
      },
      dm: {
          backgroundColor: "#41444B",
          position: "absolute",
          top: 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center"
      },
      active: {
          backgroundColor: "#34FFB9",
          position: "absolute",
          bottom: 28,
          left: 10,
          padding: 4,
          height: 20,
          width: 20,
          borderRadius: 10
      },
      add: {
          backgroundColor: "#41444B",
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center"
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

    const createDeleteAlert = () =>
        Alert.alert(
            "Delete Account",
            "You will not be able to recover your account.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: deleteProfile }
            ],
            { cancelable: false }
        );

    const deleteProfile = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return token;

        let res = await fetch('https://bussin.blakekjohnson.dev/api/user', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res = await res.json();

        logOut();
    };


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

    return (
    
      <SafeAreaView style={styles.container}>
        {profile && <>
          <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.titleBar}>
                  <Icon name="ellipsis-v" size={24} color="#52575D" onPress = {() => props.navigation.navigate("Settings")}></Icon>
              </View>
              <View style={{ alignSelf: "center" }}>
                  <View style={styles.profileImage}>
                      <Image source={require("../Assets/logo1.png")} style={styles.image} resizeMode="center"></Image>
                  </View>
                  <View style={styles.dm}>
                      <Icon name="comment" size={18} color="#DFD8C8"></Icon>
                  </View>
                  <View style={styles.active}></View>
                  <View style={styles.add}>
                      <Icon name="plus" size={30} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Icon>
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
                      <Text style={[styles.text, { fontSize: 24 }]}>23</Text>
                      <Text style={[styles.text, styles.subText]}>Events Hosted</Text>
                  </View>
                  <View style={styles.statsBox}>
                      <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
                      <Text style={[styles.text, styles.subText]}>Friends</Text>
                  </View>
              </View>

              <View style={styles.infoContainer}>
                    <Button title='Modify Account' onPress={() => props.navigation.navigate('Settings')} />
                    <Button title='Create an organization' onPress={() => props.navigation.navigate('CreateOrg')} />
                    <Button title='Log Out' onPress={logOut} />
                    <Button title='Delete Account' onPress={createDeleteAlert} />
              </View>

          </ScrollView>
          </>
        }
      </SafeAreaView>
  );
}

export default UserProfile;