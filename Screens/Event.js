import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Event = (props) => {
  const [loading, setLoading] = useState(true);
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
    props.navigation.addListener('focus', () => {
      setLoading(true);
      setError(null);
      setEvents([]);
      fetchEvents();
    });
  }, []);

  const createAlert = () =>
    Alert.alert(
      "Modify Event",
      "Edit or Delete this Event?",
      [
        {
          text: "Delete",
          onPress: () => { createDeleteAlert }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel"
        },
        { text: "Edit", onPress: () => props.navigation.navigate("EditEvent") }
      ],
      { cancelable: false }
    );


  const createDeleteAlert = () =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

  return (
    <View>
      { error ? <Text>{error}</Text> : <></>}
      {
        !loading ? <Text>Loading</Text> :
          events.map((event, index) => (
            <Text key={index} onPress={createAlert} style={{ fontSize: 20 }}>{event._id} - {event.name}  </Text>
          ))
      }
      <Button title={"Add Event"} onPress={
        () => props.navigation.navigate("CreateEvent")}>
      </Button>
    </View>
  )
}

export default Event;