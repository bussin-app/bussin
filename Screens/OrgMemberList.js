import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrgMemberList = (props) => {
  const [token, setToken] = useState(null);
  const [members, setMembers] = useState([]);
  const [sortedMembers, setSortedMembers] = useState([]);
  const [sorted, setSorted] = useState('false');
  const [source, setSource] = useState('members');
  const [data, setData] = useState([]);
  const [memberState, setMemberState] = useState("Member");

  const fetchOrgs = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/organization/getUsers", {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgID: props.route.params.item._id,
      }),
    });

    // Convert response to JSON
    response = await response.json();

    // Set data source
    
    let unsortedArray = [...response.users];
    let sortedArray = unsortedArray.sort((a, b) => { 
      return a.name.localeCompare(b.name);
    });
    setMembers(unsortedArray);
    setSortedMembers(sortedArray);
    setData(unsortedArray);
  };
  const toggleAdmin = async (item) => {
    // Add backend connection
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    if (memberState == "Member") {
      // Make into an admin
      setMemberState("Admin");

      return;
    }
    else {
      // Make into a member
      setMemberState("Member");
    }

    // Skeleton code for both Converting to admin and reverting to member

    // let response = await fetch("https://bussin.blakekjohnson.dev/api/organization/deleteUser", {
    //         method: "PUT",
    //         headers: {
    //           'Authorization': `Bearer ${storedToken}`,
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           orgID: props.route.params.item._id,
    //           delUserID: item._id,
    //         }),
    // });

    // if (response.status != 200) {
    //   console.log(response.status, await response.json());
    //   return;
    // }
  };

  const makeAdmin = async (item) => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let res = await fetch('https://bussin.blakekjohnson.dev/api/organization/makeAdmin', {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgID: props.route.params.item._id,
        newAdmin: item._id,
      }),
    });

    res = await res.json();
    fetchOrgs();
  };

  const demoteAdmin = async (item) => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let res = await fetch('https://bussin.blakekjohnson.dev/api/organization/demoteAdmin', {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgID: props.route.params.item._id,
        demAdminID: item._id,
      }),
    });

    res = await res.json();
    fetchOrgs();
  };

  const removeMember = async (item) => {
    // Add backend connection
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let response = await fetch("https://bussin.blakekjohnson.dev/api/organization/deleteUser", {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgID: props.route.params.item._id,
        delUserID: item.item._id,
      }),
    });

    if (res.status != 200) return;

    fetchOrgs();
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
  const ItemView = (item) => {
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
          {item.item.name}
        </Text>
        <View style={{ alignContents: "row"}}>
          <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }}>
          {item.item.username}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue', textAlign: 'right' }}>
          {item.item.eventPoints}
          </Text>
          <View style={{ alignContents: "row" }}>
            <Text style={{ fontSize: 20, fontFamily: 'HelveticaNeue' }}>
              {item.username}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue', textAlign: 'right' }}>
              {item.eventPoints}
            </Text>
          </View>
          <Button title={"Delete"} onPress={() => createRemoveAlert(item)} />
          <Button title={item.item.admin ? 'Admin' : 'Member'} disabled={true} />
          {
            !item.item.admin &&
            <Button title={"Make Admin"} onPress={() => {
              makeAdmin(item.item);
            }} />
          }
          {
            item.item.admin &&
            <Button title={"Demote Admin"} onPress={() => {
              demoteAdmin(item.item);
            }} />
          }
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
        <Text style={{ fontSize: 30, fontFamily: 'HelveticaNeue', fontWeight: "200" }}>Your Members</Text>
        <FlatList
          data={members}
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