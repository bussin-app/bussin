import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendList = (props) => {
  const [token, setToken] = useState(null);
  const [friends, setFriends] = useState([]);
  const [sortedFriends, setSortedFriends] = useState([]);
  const [sorted, setSorted] = useState('false');
  const [source, setSource] = useState('friends');
  const [data, setData] = useState([]);


 

  const fetchFriends = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/friends/fetch", {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
    });

    // Convert response to JSON
    response = await response.json();
    // Set data source
    setFriends(response);
    setSortedFriends(response.sort((a, b) => a.name - b.name));
    setData(response);
  };

  const removeFriend = async (item) => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);
    let response = await fetch("https://bussin.blakekjohnson.dev/api/friends/removeFriend", {
            method: "PUT",
            body: JSON.stringify({
              friendID: item._id
            }),
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
    });

    // Convert response to JSON
    response = await response.json();
    fetchFriends();
  };

  const createInvite = async (type, user) => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);
    let { item } = props.route.params;

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
     headers: {
       'Authorization': `Bearer ${token}`
     }
    });
    res = await res.json();

    let response = await fetch("https://bussin.blakekjohnson.dev/api/invites/", {
            method: "POST",
            body: JSON.stringify({
              invite: {
                  to: user._id, 
                  from: res.user._id,
                  type: type,
                  foreignID: item._id
               }
            }),
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
    });

    // Convert response to JSON
    response = await response.json();
    console.log(response);
    // Set data source
  
  };


  useEffect(() => {
    props.navigation.addListener('focus', () => {
    let { type } = props.route.params;
    setSource(type);
    fetchFriends();
    });

  }, []);

  const changeSort = () => {
    if (sorted == 'true') {
      setSorted('false');
      setData(friends);
    } else {
      setSorted('true');
      setData(sortedFriends);
    } 
  }

  const createDeleteAlert = (item) =>
        Alert.alert(
            "Delete Friend",
            "You will have to send another request to be friends.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: () => removeFriend(item) }
            ],
            { cancelable: false }
        );

  const SPACING = 20;
  const PIC_SIZE = 70
  const ItemView = ({ item }) => {
    return (
      <SafeAreaView>
      <View style={{
        width: 350, padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
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
        <View style={{ alignContents: "row"}}>
          <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }}>
          {item.username}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue', textAlign: 'right' }}>
          {item.eventPoints}
          </Text>
        </View>
        { source === 'friends' && <Button title = {"Remove"} onPress={() => createDeleteAlert(item)}/>}
        { source === 'orgs' && <Button title = {"Invite"} onPress={() => createInvite('organization', item)}/>}
        { source === 'events' && <Button title = {"Invite"} onPress={() => createInvite('event', item)}/>}
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
        <Text style={{ fontSize: 30, fontFamily: 'HelveticaNeue', fontWeight: "200" }}>Friends</Text>
        <Button title={ (sorted == 'true')? 'Sort Alphabetically' : 'Sort Oldest First' }  onPress = {() => changeSort()} />
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

export default FriendList;