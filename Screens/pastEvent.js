import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, SafeAreaView, FlatList, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PastEvent = (props) => {
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
      let res = await fetch('https://bussin.blakekjohnson.dev/api/event/past', {
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

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setLoading(true);
      setError(null);
      setEvents([]);
      fetchEvents();
    });
  }, []);

  


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
              paddingTop: StatusBar.currentHeight || 42
            }}
            renderItem={ItemView}
          />
        </View>
      }
      
      
      </SafeAreaView>
  );
    
  
  }

export default PastEvent;