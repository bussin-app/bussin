import React, { useState, Component } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";

import Event from "./Event.js";


const attendEvent = (props) => {
    const [event, setEvent] = useState([]);
    const [error, setError] = useState(null);
    // TODO: fetch an Event from event:_ID
    // display the information of the event
    const fetchEvent = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');

        if (!token) return;

        try {
            let res = await fetch('https://bussin.blakekjohnson.dev/api/attendEvent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            res = await res.json();

            setEvent(res.events);
        } catch (e) {
            setError(e);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    if (error) {
        return <View><Text>{error}</Text></View>
    }


    const attendEvent = async () => {

        // get the user information
        // TODO: fetch the user data from the user:_ID
        let userData = {}

        // Send the request
        let token = await AsyncStorage.getItem('@bussin-token');
        let res = await fetch('https://bussin.blakekjohnson.dev/api/attendEvent/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: userData
            }),
        });

        // Accept the response
        res = await res.json();
        console.log(res);

        props.navigation.navigate('Event');
    };

    return (
        // display the information of the event
        // return a basic UI that shows event ID and event Name for now
        // TODO: add features to display calendar
        // click the button to update to the database & send request to the backend
        <View>
            {
                <FormContainer title="attendEvent">
                    <Text key={index}>{event._id} - {event.name}</Text>
                    
                </FormContainer>
            }
            <Button title={"Create"} onPress={attendEvent} />
        </View>
    )

    
}

export default attendEvent;