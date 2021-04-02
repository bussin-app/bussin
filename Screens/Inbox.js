import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inbox = (props) => {
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(['friends']);
  const [title, setTitle] = useState(['friends']);




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

    console.log('Before the fetch');
    let response = await fetch("https://bussin.blakekjohnson.dev/api/invites/inviteInbox", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    // Convert response to JSON
    response = await response.json();
    console.log(response);

    // Set data sources
    setData(response);
  };



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
      console.log(res);

    } else {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/invites/respond', {
        method: 'DELETE',
        body: JSON.stringify({
          invite: {
            to: item.to,
            from: item.from._id,
            type: item.type,
            response: status,
            _id: item._id
          }
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      res = await res.json();
      console.log(res);
    }

  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      fetchRequests();
    });
  }, []);

  const changeFilter = (filter) => {
    if (filter == 'friends') {
      setFilter('invites');
      fetchInvites();
    } else {
      setFilter('friends');
      fetchRequests();
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
          <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            {(filter == 'invites') ? 'Event Invite From:' : 'Friend Request From:'}
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
            {item.from.name}  ({item.from.username})
        </Text>
          {filter == 'invites' && <Text style={{ fontWeight: "200", fontSize: 25, fontFamily: 'HelveticaNeue' }}>To:</Text>}
          {filter == 'invites' && <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }}>{item.foreignID.name}</Text>}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button title={"Accept"} onPress={() => replyRequest(1, item)}></Button>
            <Button title={"Deny"} onPress={() => replyRequest(2, item)}></Button>
          </View>

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
        <Button title={(filter != 'friends') ? 'Invites' : 'Friend Request'} onPress={() => changeFilter(filter)} />
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