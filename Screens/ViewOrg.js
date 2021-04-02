import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewOrg = (props) => {
  const [name, setName] = useState('');
  //const [host, setHost] = useState('');

  const fetchOrgData = async () => {
    let { organization } = props.route.params;
    setName(organization.name);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user/${organization.host}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    res = await res.json();
    setHost(res.user.name);
    console.log(res.user.name);

    res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    setAttending(organization.attendees.includes(res.user._id));
  };

  const follow = async () => {
    let token = await AsyncStorage.getItem('@bussin-token');
    if (token) return;
      
    let res = await fetch(`https://bussin.blakekjohnson.dev/api/follow/${item._id}`, {
      methods: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    res = await res.json();
  };

  useEffect(() => {
    props.navigation.addListener('focus', fetchOrgData);
  }, []);

  const styles = StyleSheet.create({
    
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },

    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },

    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    }
    
  });

  return (
  <SafeAreaView>
        <View style={styles.infoContainer}>
      <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{name}</Text>
    </View>
  </SafeAreaView>
  );
};

export default ViewOrg;