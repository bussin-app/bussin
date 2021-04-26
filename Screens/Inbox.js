import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inbox = (props) => {
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(['friends']);
  const [title, setTitle] = useState(['friends']);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const fetchRequests = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/friends/friendInbox", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    // Convert response to JSON
    response = await response.json();

    // Set data sources
    setData(response);
  };

  const fetchInvites = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/invites/inviteInbox", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    // Convert response to JSON
    response = await response.json();

    // Set data sources
    setData(response);
  };

  const fetchReminders = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/reminder/reminderInbox", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    // Convert response to JSON
    response = await response.json();

    // Set data sources
    setData(response);
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
      let formattedString = timeValue + " on " + month[monthNum -1] + " " + curDate + ", " + year; 
      //let formattedString =month[monthNum - 1] + " " + curDate + ", " + year;
      return(formattedString);

  }



  const replyRequest = async (status, item) => {
    if (filter == 'friends') {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/friends/friendRespond', {

        method: 'DELETE',
        body: JSON.stringify({
          request: {
            to: item.to,
            from: item.from._id,
            response: status
          }
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      res = await res.json();

    } else {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/invites/respond', {
        method: 'DELETE',
        body: JSON.stringify({
          invite: {
            to: item.to,
            from: item.from._id,
            type: item.type,
            response: status,
            foreignID: item.foreignID._id,
            _id: item._id
          }
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      res = await res.json();
    }

  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      if (filter == 'friends') {
        fetchRequests();
      } else if (filter == 'invites') {
        fetchInvites();
      }
      else {
        fetchReminders();
      }
    });
  }, []);

  useEffect(() => {
    if (filter == 'friends') {
      fetchRequests();
    } else if (filter == 'invites') {
      fetchInvites();
    } else if (filter == 'reminders') {
      fetchReminders();
    }
  }, [filter]);

  const dismissReminder = async (item) => {
    let reminderURI = `https://bussin.blakekjohnson.dev/api/reminder/${item._id}`;
    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    await fetch(reminderURI, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReminders();
  };

  const changeFilter = async (filter) => {
    if (filter == 'friends') {
      setFilter('invites');
    } else if (filter == 'invites') {
      setFilter('reminders');
    }
    else {
      setFilter('friends');
    }
  }

  const SPACING = 20;
  const PIC_SIZE = 70
  const ItemView = ({ item }) => {
    return (
      <SafeAreaView>
        <View style={{
          width: 350, padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
          shadowColor: "#355070",
          shadowOffset: {
            width: 0,
            height: 10
          },
          shadowOpacity: .3,
          shadowRadius: 20
        }}>
          {filter == 'friends' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            Friend Request From:</Text>}
          {filter == 'invites' && item.type == 'organization' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            Organization Invite From:</Text>}
          {filter == 'invites' && item.type == 'event' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            Event Invite From:</Text>}
          {filter == 'reminders' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            Reminder From:</Text>}
          <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue', fontWeight: "300"  }} onPress={() => getItem(item)}>
            {item.from.name}  ({item.from.username})
        </Text>
          {filter == 'invites' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }}>To:</Text>}
          {filter == 'invites' && item && item.foreignID && <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue', fontWeight: "300"  }}>{item.foreignID.name}</Text>}
          {filter == 'reminders' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }}>For:</Text>}
          {filter == 'reminders' && item && <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue', fontWeight: "300"  }}>{item.eventID.name} at {formatDate(item.eventID.date)}</Text>}
          {
            filter != 'reminders' &&
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button title={"Accept"} onPress={() => replyRequest(1, item)}></Button>
              <Button title={"Deny"} onPress={() => replyRequest(2, item)}></Button>
            </View>
          }
          {
            filter == 'reminders' &&
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button title={"Dismiss"} onPress={() => dismissReminder(item)}></Button>
            </View>
          }

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
    props.navigation.navigate('viewUserProfile', { user: item });
  };

  if (!token) {
    return <View><Text>To get started login at the user page.</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
      
        {filter == 'friends' && 
          <Button title = 'Friend Request' onPress={() => changeFilter(filter)} />
        }
        {filter == 'invites' && 
          <Button title = 'Invites' onPress={() => changeFilter(filter)} />
        }
        {filter == 'reminders' && 
          <Button title = 'Reminders' onPress={() => changeFilter(filter)} />
        }
        </View>
      <View style={{ alignItems: 'center' }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42
          }}
          renderItem={ItemView}
        />
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

export default Inbox;