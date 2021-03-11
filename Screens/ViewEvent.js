import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewEvent = (props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [host, setHost] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [eventID, setEventID] = useState('');
  const [attending, setAttending] = useState(true);

  const fetchEventData = async () => {
    let { event } = props.route.params;

    setName(event.name);
    setDescription(event.description || 'No description');
    setAttendeeCount(event.attendees.length || 0);
    setDate(event.date);
    setEventID(event._id);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user/${event.host}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    res = await res.json();
    setHost(res.user.name);

    res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    setAttending(event.attendees.includes(res.user._id));
  };

  useEffect(() => {
    props.navigation.addListener('focus', fetchEventData);
  }, []);

  const attend = async () => {
    let { event } = props.route.params;

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();

    res = await fetch('https://bussin.blakekjohnson.dev/api/event/markAttendance', {
      method: 'PUT',
      body: JSON.stringify({
        userID: res.user._id,
        eventID: event._id,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status != 200) return;

    setAttending(true);
    setAttendeeCount(attendeeCount + 1);
  };

  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>Description: {description}</Text>
      <Text>Number of Attendees: {attendeeCount}</Text>
      <Text>Host: {host}</Text>
      <Text>Date: {date}</Text>
      { attending && <Text>You are already attending this event</Text>}
      { !attending && <Button title='Attend' onPress={attend} />}
    </View>
  );

};

export default ViewEvent;