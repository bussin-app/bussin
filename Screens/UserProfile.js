import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, Button, withStyles } from 'react-native-ui-kitten'

import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = (props) => {
    const [profile, setProfile] = useState(null);
    const [fetched, setFetched] = useState(false);
    const themedStyle = withStyles(theme => ({
        root: {
          backgroundColor: theme['color-basic-100'],
          marginTop: 60
        },
        header: {
          alignItems: 'center',
          paddingTop: 25,
          paddingBottom: 17
        },
        userInfo: {
          flexDirection: 'row',
          paddingVertical: 18
        },
        bordered: {
          borderBottomWidth: 1,
          borderColor: theme['color-basic-400']
        },
        section: {
          flex: 1,
          alignItems: 'center'
        },
        space: {
          marginBottom: 3,
          color: theme['color-basic-1000']
        },
        separator: {
          backgroundColor: theme['color-basic-400'],
          alignSelf: 'center',
          flexDirection: 'row',
          flex: 0,
          width: 1,
          height: 42
        },
        buttons: {
          flexDirection: 'row',
          paddingVertical: 8
        },
        button: {
          flex: 1,
          alignSelf: 'center'
        },
        text: {
          color: theme['color-basic-1000']
        }
      }))


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
        return <View></View>;
    }

    return (
        <View style={themedStyle.root}>
          <View style={[themedStyle.header, themedStyle.bordered]}>
            <Text category='h6' style={themedStyle.text}>
              Test User
            </Text>
          </View>
          <View style={[themedStyle.userInfo, themedStyle.bordered]}>
            <View style={themedStyle.section}>
              <Text appearance='hint' category='s2'>
                Points
              </Text>
            </View>
            <View style={themedStyle.section}>
              <Text category='s1' style={themedStyle.space}>
                0
              </Text>
              <Text appearance='hint' category='s2'>
                Friends
              </Text>
            </View>
            <View style={themedStyle.section}>
              <Text category='s1' style={themedStyle.space}>
                0
              </Text>
              <Text appearance='hint' category='s2'>
                Following
              </Text>
            </View>
          </View>
          <View style={themedStyle.buttons}>
          <Button
              style={themedStyle.button}
              appearance='ghost'
              status='danger'
              onPress={() => props.navigation.navigate('Settings')}>
              MODIFY ACCOUNT
            </Button>
            <Button
              style={themedStyle.button}
              appearance='ghost'
              status='danger'
              onPress={() => props.navigation.navigate('CreateOrg')}>
              CREATE ORGANIZATION
            </Button>
            <Button
              style={themedStyle.button}
              appearance='ghost'
              status='danger'
              onPress={logOut}>
              LOGOUT
            </Button>
            <Button
              style={themedStyle.button}
              appearance='ghost'
              status='danger'
              onPress={createDeleteAlert}>
              DELETE
            </Button>
            <View style={themedStyle.separator} />
            <Button style={themedStyle.button} appearance='ghost' status='danger'>
              MESSAGE
            </Button>
          </View>
        </View>
      )
}

export default UserProfile;
