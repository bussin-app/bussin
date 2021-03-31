import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, SafeAreaView, FlatList, StatusBar } from 'react-native';
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

  const createAlert = (event) => {
    if (event.private) {
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
        { text: "Invite Friends", onPress: () => props.navigation.navigate("FriendList")},
        { text: "Start", onPress: () => console.log("Start") }
      ],
      { cancelable: false }
      );
    } else {
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
    }
  }
       
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

      let formattedString = timeValue + " on " + month[monthNum - 1] + " " + curDate + ", " + year;
      return formattedString;
    }


    const SPACING = 20;
    const ItemView = ({ item }) => {
      return (
        <View style={{
          flexDirection: 'column', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
          shadowColor:"#355070",
          shadowOffset: {
            width: 0,
            height: 10
          },
          shadowOpacity: .3,
          shadowRadius: 20
        }}>
          <Text style={{ fontSize: 25, fontFamily: 'HelveticaNeue', fontWeight: "200" }} onPress={() => getItem(item)}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }}>
            {item.description}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue', textAlign: 'right' }}>
            {formatDate(item.date)}
          </Text>
        </View>
      );
    };
  
    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#C8C8C8',
          }}
        />
      );
    };
  
    const getItem = (item) => {
      createAlert(item);
    };
  
    if (!token) {
      return <View><Text>To get started login at the user page.</Text></View>;
    }
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: "HelveticaNeue", fontSize: 36, marginTop: 5, fontWeight: "200"}}>My Events</Text>
        </View>
        { error && <Text>{error}</Text>}
      {
        loading ? <Text>Loading</Text> :
        <View>
          <FlatList
            data={events}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            contentContainerStyle={{
              padding: SPACING,
              paddingTop: StatusBar.currentHeight || 42
            }}
            renderItem={ItemView}
          />
        </View>
      }
      {
          token &&
          <View>
            <Button title={"Add Event"} onPress={
              () => props.navigation.navigate("CreateEvent")}>
            </Button>
          </View>
          
      }
      
      </SafeAreaView>
    );
}

export default Event;