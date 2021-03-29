import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inbox = (props) => {
  const [token, setToken] = useState(null);
  const [requests, setRequests] = useState([]);

 

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
    setRequests(response);
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
    fetchRequests();
    });
  }, []);

  const SPACING = 20;
  const PIC_SIZE = 70
  const ItemView = ({ item }) => {
    return (
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
        <Text style={{ fontWeight: "200", fontSize: 20, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
          Friend Request From:
        </Text>
        <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }} onPress={() => getItem(item)}>
          {item.from.name}
        </Text>
        <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue' }}>
          {item.from.username}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button title={"Accept"} onPress={() =>console.log("Accept")}></Button>
          <Button title={"Deny"} onPress={() => console.log("Deny")}></Button>
        </View>
        
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
      props.navigation.navigate('viewUserProfile', { user: item });
  };

  if (!token) {
    return <View><Text>To get started login at the user page.</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <FlatList
          data={requests}
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