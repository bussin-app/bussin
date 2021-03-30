import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, SafeAreaView, FlatList, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Organization = (props) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState([]);

  const fetchOrganizations = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');

    if (!storedToken) {
      setLoading(false);
      setError('To get started login at the user page.');
      return;
    }
    setToken(storedToken);

    try {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/organization', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      res = await res.json();

      setOrganization(res.organization);
    } catch (e) {
      setError(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setLoading(true);
      setError(null);
      setOrganizations([]);
      fetchOrganizations();
    });
  }, []);

  const createAlert = (organization) => {
    if (organization.following) {
      Alert.alert(
      "Update Organization",
      "Edit this Organization?",
      [
        {
          text: "Remove",
          onPress: () => console.log("Delete"),
          style: "Remove"
        }
      ],
      { cancelable: false }
      );
    } else {
      Alert.alert(
        "Update organization",
        "Edit or invite?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel"),
            style: "cancel"
          },
          { text: "Edit", onPress: () => props.navigation.navigate("EditOrg", { organization }) },
          { text: "Invite Friends", onPress: () => props.navigation.navigate("FriendList")},
        ],
        { cancelable: false }
      );
    }
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
            {organization.name}
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
          <Text style={{ fontFamily: "HelveticaNeue", fontSize: 36, marginTop: 5, fontWeight: "200"}}>My organizations</Text>
        </View>
        { error && <Text>{error}</Text>}
      {
        loading ? <Text>Loading</Text> :
        <View>
          <FlatList
            data={evitements}
            keyExtractor={(organization, index) => index.toString()}
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
            <Button title={"Add Organzation"} onPress={
              () => props.navigation.navigate("CreateOrg")}>
            </Button>
          </View>
      }
      </SafeAreaView>
    );
}

export default Organization;