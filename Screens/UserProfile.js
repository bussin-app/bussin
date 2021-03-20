import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = (props) => {
    const [profile, setProfile] = useState(null);
    const [fetched, setFetched] = useState(false);

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
        <View>
            {
                profile &&
                <>
                    <Text>Name: {profile.name}</Text>
                    <Text>Username: {profile.username}</Text>
                    <Text>Points: {profile.eventPoints}</Text>
                    <Button title='Modify Account' onPress={() => props.navigation.navigate('Settings')} />
                    <Button title='Create an organization' onPress={() => props.navigation.navigate('CreateOrg')} />
                    <Button title='Log Out' onPress={logOut} />
                    <Button title='Delete Account' onPress={createDeleteAlert} />
                </>
            }
        </View>
    )
}

export default UserProfile;
