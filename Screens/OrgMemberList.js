import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrgMemberList = (props) => {
  const [token, setToken] = useState(null);
  const [members, setMembers] = useState([]);
  const [sortedMembers, setSortedMembers] = useState([]);
  const [sorted, setSorted] = useState('false');
  const [source, setSource] = useState('members');
  const [data, setData] = useState([]); 

  const fetchOrgs = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/organization/members", {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
    });

    // Convert response to JSON
    response = await response.json();
    // Set data source
    
    let unsortedArray = [...response];
    let sortedArray = response.sort((a, b) => { 
      return a.name.localeCompare(b.name);
    });
    setMembers(unsortedArray);
    setSortedMembers(sortedArray);
    setData(unsortedArray);
  };

  const removeMember = async (item) => {
    // Add backend connection
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
    let { type } = props.route.params;
    setSource(type);
    fetchOrgs();
    });

  }, []);

  const createRemoveAlert = (item) =>
        Alert.alert(
            "Remove member",
            "",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Remove", onPress: () => removeMember(item) }
            ],
            { cancelable: false }
        );

  const SPACING = 20;
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
            <Button title = {"Delete"} onPress={() => createRemoveAlert(item)}/>
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
        <Text style={{ fontSize: 30, fontFamily: 'HelveticaNeue', fontWeight: "200" }}>Your Members</Text>
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

export default OrgMemberList;