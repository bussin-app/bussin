import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = (props) => {
    const [profile, setProfile] = useState(null);
    const [fetched, setFetched] = useState(false);

    const fetchProfile = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');

        let res = await fetch("https://bussin.blakekjohnson.dev/api/user", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let data = await res.json();

        console.log(data.user);
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

    useEffect(() => {
        if (!fetched) {
            fetchProfile();
            setFetched(true);
        }
    }, [fetched]);

    if (!profile) {
        return <View><Text>Loading...</Text></View>;
    }

    return (
        <View>
            <Text>Name: {profile.name}</Text>
            <Text>Username: {profile.username}</Text>
            <Text>Gender: {profile.gender}</Text>
            <Button title='Log Out' onPress={logOut} />
        </View>
    )
}

export default UserProfile;