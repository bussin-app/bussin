import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Event = (props) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');

    if (!storedToken) {
      setLoading(false);
      setError('To get started login at the user page.');
      return;
    }
    setToken(storedToken);

    try {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/event', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      res = await res.json();

      setEvents(res.events);
    } catch (e) {
      setError(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setLoading(true);
      setError(null);
      setEvents([]);
      fetchEvents();
    });
  }, []);

  const createAlert = (event) =>
    Alert.alert(
      "Update Event",
      "Edit or Start this Event?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel"
        },
        { text: "Edit", onPress: () => props.navigation.navigate("EditEvent", { event }) },
        { text: "Start", onPress: () => console.log("Start") }
      ],
      { cancelable: false }
    );

  return (
    <View>
      { error && <Text>{error}</Text>}
      {
        loading ? <Text>Loading</Text> :
          events.map((event, index) => (
            <Text key={index} onPress={() => createAlert(event)} style={{ fontSize: 20 }}>{event._id} - {event.name}  </Text>
          ))
      }
      {
        token &&
        <Button title={"Add Event"} onPress={
          () => props.navigation.navigate("CreateEvent")}>
        </Button>
      }
    </View>
  )
}

export default Event;