import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Event = (props) => {
  const [token, setToken] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [eventArray, setEventArray] = useState([]);
  const [sortedEventArray, setSortedEventArray] = useState([]);
  const [sorted, setSorted] = useState('false');
  const [status, setStatus] = useState("host_events");

  const fetchData = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let source;
    if (status == 'host_events') {
      source = 'https://bussin.blakekjohnson.dev/api/event/';
    } else if (status == 'attend_events') {
      source = 'https://bussin.blakekjohnson.dev/api/event/attend';
    } else {
      source = 'https://bussin.blakekjohnson.dev/api/organization/';
    }
    
    let response = await fetch(source, {
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      }
    });

    // Convert response to JSON
    response = await response.json();

  //console.log(response.items);
    
    // Set data sources
    setFilteredDataSource(response.items);
    setMasterDataSource(response.items);

    if (source === 'https://bussin.blakekjohnson.dev/api/event/' || source === 'https://bussin.blakekjohnson.dev/api/event/attend') {
      setEventArray(response.items);
      setSortedEventArray(response.items.sort((a, b) => {
        return a.attendees.length - b.attendees.length;
      }));


    }
  };

  const startEvent = async (item) => {
    // Construct the date based on time and date
    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;
    let res;
    try {
        res = await fetch(`https://bussin.blakekjohnson.dev/api/event/${item._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ update: { past: true } }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (e) { console.error(e); return; }
};

  const sendReminder = async (item) => {
    let attendees = item.attendees;
    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;
    
    for(let attendee of attendees) {
      let response = await fetch("https://bussin.blakekjohnson.dev/api/reminder/", {
            method: "POST",
            body: JSON.stringify({
              reminder: {
                  to: attendee, 
                  eventID: item._id,
                  description: "testing"
               }
            }),
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
      });
    }
  }

  

  const focusWrapper = () => {
    fetchData();
  };

  useEffect(() => {
    props.navigation.addListener('focus', focusWrapper);
  }, []);


  const createAlert = (item) => {
    if (status == 'organizations') {
        Alert.alert(
        "Update Organization",
        "Edit or Invite to Organization",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel"),
            style: "cancel"
          },
          { text: "Edit", onPress: () => props.navigation.navigate("EditOrg", { item }) },
          { text: "See members", onPress: () => props.navigation.navigate("OrgMemberList", {type: "orgs", item})},
          { text: "Invite Friends", onPress: () => props.navigation.navigate("FriendList", {type: "orgs", item})}
        ],
        { cancelable: false }
        );
    } else if (status == 'host_events') {
      if (item.private) {
      Alert.alert(
      "Update Event",
      "Edit or Start this Event?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel"
        },
        { text: "Edit", onPress: () => props.navigation.navigate("EditEvent", { event: item }) },
        { text: "Invite Friends", onPress: () => props.navigation.navigate("FriendList", {type: "events", item })},
        { text: "Send Reminder", onPress: () => sendReminder(item)},
        { text: "Start", onPress: () => startEvent(item)}
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
          { text: "Edit", onPress: () => props.navigation.navigate("EditEvent", { event: item }) },
          { text: "Send Reminder", onPress: () => sendReminder(item)},
          { text: "Start", onPress: () => startEvent(item) }
        ],
        { cancelable: false }
      );
    }
  } else if (status  == 'attend_events') {
    Alert.alert(
      "View Event",
      "View this Event?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel"
        },
        { text: "View", onPress: () => props.navigation.navigate("ViewEvent", { event: item }) },
      ],
      { cancelable: false }
    );
  }
}

  useEffect(() => {
    fetchData();
  }, [status]);

  const changeStatus = (status) => {
    if (status == 'host_events') {
      setStatus('attend_events');
    } else if (status == 'attend_events') {
      setStatus('organizations');
    } else {
      setStatus('host_events');
    }

  }

  const formatDate = (date) => {
    if (date == undefined) {
      return '';
    }

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
    let formattedString =month[monthNum - 1] + " " + curDate + ", " + year;
    return formattedString;
  }

  const changeSort = () => {
    if (sorted === 'true') {
      setSorted('false');
      console.log()
      setFilteredDataSource(sortedEventArray);
    } else {
      setSorted('true');
      setFilteredDataSource(eventArray);
    }
  }

  const SPACING = 20;
  const ItemView = ({ item }) => {
    return (
      <SafeAreaView>
        <View style={{
        flexDirection: 'column', padding: SPACING, marginBottom: SPACING, fontFamily: 'HelveticaNeue', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
        shadowColor:"#355070",
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20
      }}>
        <Text style={{ fontSize: 25, fontWeight: "200" }} onPress={() => createAlert(item)}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 20 }} onPress={() => createAlert(item)}>
          {item.description || ""}
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'right' }} onPress={() => createAlert(item)}>
          {formatDate(item.date) || ""}
        </Text>
      </View>
      </SafeAreaView>
      
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
    if (status == 'host_events')
      props.navigation.navigate('ViewEvent', { event: item });
    else if ( status == 'organizations') {
      props.navigation.navigate('ViewOrg', { organization: item });
    } else {
      props.navigation.navigate('ViewEvent', { event: item });
    }
      
  };

  if (!token) {
    return <View><Text>To get started login at the user page.</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
      <Button title={ (status == 'host_events')?"My Hosted Events":
        ((status == 'attend_events')?"My Attending Events":"My Organizations"
        )} onPress = {() => changeStatus(status)} />
      </View>
      <View style={{ textAlign: 'left' }}>
      <Button title={ (status == 'host_events')?"Sort":
        ((status == 'attend_events')?"Sort":" "
        )} onPress = {() => changeSort()} />
      </View>
      <View>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42
          }}
          renderItem={ItemView}
        />
      </View>
      <View>
      { status == 'host_events' && <Button title='Create an Event' onPress={() => props.navigation.navigate('CreateEvent')} />}
      { status == 'organizations' && <Button title='Create an Organization' onPress={() => props.navigation.navigate('CreateOrg')} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  itemStyle: {
    padding: 10,
  },
});

export default Event;
