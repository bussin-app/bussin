import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewEvent = (props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [host, setHost] = useState('');
  const [date, setDate] = useState('');
  const [full, setFull] = useState(false);
  const [eventID, setEventID] = useState('');
  const [attending, setAttending] = useState(true);
  const [maxAttendees, setMaxAttendees] = useState('');

  const fetchEventData = async () => {
    let { event } = props.route.params;

    setName(event.name);
    setDescription(event.description || 'No description');
    setAttendeeCount(event.attendees.length || 0);
    setDate(event.date);
    setEventID(event._id);
    setMaxAttendees(event.maxAttendees);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    
    setHost(event.host.ref.name);

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    setFull(event.attendees.length >= event.maxAttendees);
    setAttending(event.attendees.includes(res.user._id));
  };

  useEffect(() => {
    props.navigation.addListener('focus', fetchEventData);
  }, []);

  const attend = async () => {
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
        eventID: eventID,
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

  const styles = StyleSheet.create({
    
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },

    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
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

  return (
  <SafeAreaView>
        <View style={styles.infoContainer}>
      <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{name}</Text>
      <Text style={[styles.subText, { fontSize: 20}]}>{description}</Text>
    </View>
    <View style={styles.statsContainer}>
      <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24 }]}>{maxAttendees}</Text>
          <Text style={[styles.text, styles.subText]}>Max Attendees</Text>
       </View>
       <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24 }]}>{attendeeCount}</Text>
          <Text style={[styles.text, styles.subText]}>Current Attendees</Text>
       </View>
       <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24 }]}>{maxAttendees - attendeeCount}</Text>
          <Text style={[styles.text, styles.subText]}>Space Left</Text>
       </View>
    </View>
    <View style={[styles.infoContainer, {alignContent: 'start'}]}>
      <Text style={[styles.text, { fontSize: 20}]}>Host: {host}</Text>
      <Text style={[styles.text, { fontSize: 20}]}>Date: {date}</Text>
      { attending && <Text style={[styles.text, { fontSize: 20}]}>You are already attending this event</Text>}
      { full && <Text style={[styles.text, { fontSize: 20}]}>This event has reached the max number of attendees</Text>}
      { !attending && !full && <Button style={[styles.text, { fontSize: 20}]} title='Attend' onPress={attend} />}
    </View>
  </SafeAreaView>
    
  );

};

export default ViewEvent;
