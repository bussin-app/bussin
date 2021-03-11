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
  };

  useEffect(() => {
    props.navigation.addListener('focus', fetchEventData);
  }, []);

  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>Description: {description}</Text>
      <Text>Number of Attendees: {attendeeCount}</Text>
      <Text>Host: {host}</Text>
      <Text>Date: {date}</Text>
    </View>
  );

};

export default ViewEvent;