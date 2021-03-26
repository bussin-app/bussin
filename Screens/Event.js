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
      let time = date.split(':');
      let hours = time[0].substring(time[0].length - 2);
      let minutes = time[1];

      // calculate
      let timeValue;

      if (hours > 0 && hours <= 12) {
        timeValue = hours;
      } else if (hours > 12) {
        timeValue = "" + (hours - 12);
      } else if (hours == 0) {
        timeValue = "12";
      }
      
      timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
      timeValue += (hours >= 12) ? " pm" : " am";  // get AM/PM

      let formattedString = curDate + " " + month[monthNum - 1] + ", " + year + " " + timeValue;
      return formattedString;
    }

  return (
    <View style={{ backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 20, color: '#4B4B4B', fontFamily: 'Verdana', textAlign: 'center', backgroundColor: '#f5f5f5', borderColor: '#4CAF50', paddingVertical: 5}}
        >My Events</Text>
      { error && <Text>{error}</Text>}
      {
        loading ? <Text>Loading</Text> :
          events.map((event, index) => (
            <View>
              <Text key={index} onPress={() => createAlert(event)} style={{ fontSize: 20, color: '#4B4B4B', fontFamily: 'Verdana', textAlign: 'left', backgroundColor: '#f5f5f5', borderColor: '#4CAF50', paddingLeft: 30, paddingTop: 5}}>{event.name}</Text>
              <Text key={index} onPress={() => createAlert(event)} style={{ fontSize: 15, color: '#888888', fontFamily: 'Verdana', textAlign: 'left', backgroundColor: '#f5f5f5', paddingVertical: 5, paddingLeft: 33}}>{event.description}</Text>
              <Text key={index} onPress={() => createAlert(event)} style={{ fontSize: 15, color: '#6D597A', fontFamily: 'Verdana', textAlign: 'left', backgroundColor: '#f5f5f5', paddingBottom: 20, paddingLeft: 33}}>{(formatDate(event.date))} </Text>
            </View>
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