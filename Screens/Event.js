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
    
    const formatDate = (date) => {
      let dateParts = date.split("-");
      let year = dateParts[0];
      let monthNum = dateParts[1];
      let curDate = dateParts[2].substring(0,2);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";
      let formattedString = curDate + " " + month[monthNum - 1] + ", " + year;
      return formattedString;
    }

  return (
    <View style={{ backgroundColor: '#f5f5f5' }}>
      { error && <Text>{error}</Text>}
      {
        loading ? <Text>Loading</Text> :
          events.map((event, index) => (
            <Text key={index} onPress={() => createAlert(event)} style={{ fontSize: 20, color: 'black', fontFamily: 'Verdana', textAlign: 'left', backgroundColor: '#f5f5f5', border: '1px solid', borderColor: '#4CAF50', paddingLeft: 30}}>{event.name}  •  {formatDate(event.date)} </Text>
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