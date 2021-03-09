import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Event = (props) => {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');

        if (!token) return;

        try {
            let res = await fetch('https://bussin.blakekjohnson.dev/api/event', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            res = await res.json();

            setEvents(res.events);
        } catch (e) {
            setError(e);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (error) {
        return <View><Text>{error}</Text></View>
    }

    return (
        <View>
            {
                events.map((event, index) => (
                    <Text key={index}>{event._id} - {event.name}</Text>
                ))
            }
            <Button title={"Add Event"} onPress={
                () => props.navigation.navigate("createEvent")}>
            </Button>
        </View>
    )
}

export default Event;