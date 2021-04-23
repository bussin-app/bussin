import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView, Linking, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";



const ViewEvent = (props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [host, setHost] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [full, setFull] = useState(false);
  const [eventID, setEventID] = useState('');
  const [attending, setAttending] = useState(true);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [rating, setRating] = useState(0);
  const [event, setEvent] = useState("");
  const [url, setURL] = useState('');

  const fetchEventData = async () => {
    let { event } = props.route.params;

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;
    
    try {
      let res = await fetch(`https://bussin.blakekjohnson.dev/api/event/${event._id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
    
      res = await res.json();
      res = res.event;

      setEvent(res);
      setName(res.name);
      setDescription(res.description || 'No description');
      setAttendeeCount(res.attendees.length || 0);
      setDate(formatDate(res.date));
      setEventID(res._id);
      setMaxAttendees(res.maxAttendees);
      setRating(res.rating);
      setURL(res.url || '');
      
      
      setHost(res.host.ref.name);

      let response = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      response = await res.json();
      setFull(event.attendees.length >= event.maxAttendees);
      setAttending(event.attendees.includes(response.user._id));

    } catch (e) {return;}
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


  const formatDate = (date) => {
    if (date == undefined) {
      return '';
    }

    let dateParts = date.split("-");
    let year = dateParts[0];
    let monthNum = dateParts[1];
    let curDate = dateParts[2].substring(0,2);
    if (curDate < 10) {
      curDate = dateParts[2].substring(1,2);
    }
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

      //let formattedString = curDate + " " + month[monthNum - 1] + ", " + year + " " + timeValue;
      let formattedString = month[monthNum -1] + " " + curDate + ", " + year; 
      //let formattedString =month[monthNum - 1] + " " + curDate + ", " + year;
      setTime(timeValue);
    return formattedString;
  }


  const styles = StyleSheet.create({
    image: {
      flex: 1,
      height: undefined,
      width: undefined
    },
    titleBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
      marginHorizontal: 16,
      marginLeft: 390
    },
    profileImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#000000"
    },
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
        marginTop: 32,
        fontWeight: "300"
    },
    descContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 10
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    }
    
  });

  return (
  <SafeAreaView>
    <View style={styles.titleBar}></View>
    <View style={{ alignSelf: "center" }}>
        <View style={styles.profileImage}>
            <Image source={require("../Assets/logo2.png")} style={styles.image} resizeMode="center"></Image>
        </View>
    </View>
    <View style={styles.infoContainer}>
      <Text style={[styles.text, { fontWeight: "200", fontSize: 36, color: '#B92126'}]}>{name}</Text>
      <Text style={[styles.text, { fontSize: 20, fontWeight: "300"}]}>{description}</Text>
    </View>
    <View style={styles.statsContainer}>
      <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: "300" }]}>{maxAttendees}</Text>
          <Text style={[styles.text, styles.subText]}>Max Attendees</Text>
       </View>
       <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: "300" }]}>{attendeeCount}</Text>
          <Text style={[styles.text, styles.subText]}>Current Attendees</Text>
       </View>
       <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: "300" }]}>{maxAttendees - attendeeCount}</Text>
          <Text style={[styles.text, styles.subText]}>Space Left</Text>
       </View>
       <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: "300" }]} onPress={() => props.navigation.navigate('Ratings', {event})}>{rating}</Text>
          <Text style={[styles.text, styles.subText]} onPress={() => props.navigation.navigate('Ratings', {event})}>Ratings</Text>
       </View>
    </View>
    <View style={[styles.descContainer]}>
      <Text style={[styles.text, { fontSize: 24, color: '#B92126', fontWeight: "200"}]}>Host: </Text>
      <Text style={[styles.text, { fontSize: 24, fontWeight: "300"}]}>{host}</Text>
    </View>
    <View style={[styles.descContainer]}>
      <Text style={[styles.text, { fontSize: 24, color: '#B92126', fontWeight: "200"}]}>Time: </Text>
      <Text style={[styles.text, { fontSize: 24, fontWeight: "300"}]}>{time}</Text>
    </View>
    <View style={[styles.descContainer]}>
      <Text style={[styles.text, { fontSize: 24, color: '#B92126', fontWeight: "200"}]}>Date: </Text>
      <Text style={[styles.text, { fontSize: 24, fontWeight: "300"}]}>{date}</Text>
    </View>
    <View style={[styles.infoContainer]}>
      <Text onPress={() => Linking.openURL(url)}>
        {url}
      </Text>
      { attending && <Text style={[styles.text, { fontSize: 20 , fontWeight: "300"}]}>You are already attending this event</Text>}
      { full && <Text style={[styles.text, { fontSize: 20, fontWeight: "300"}]}>This event has reached the max number of attendees</Text>}
      { !attending && !full && <Button style={[styles.text, { fontSize: 20, fontWeight: "300"}]} title='Attend' onPress={attend} />}
    </View>
  </SafeAreaView>
  );
};

export default ViewEvent;
