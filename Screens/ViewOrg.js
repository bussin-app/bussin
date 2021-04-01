import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewOrg = (props) => {
  const [name, setName] = useState('');
  //const [host, setHost] = useState('');

  const fetchEventData = async () => {
    let { event } = props.route.params;
    setName(event.name);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    // let res = await fetch(`https://bussin.blakekjohnson.dev/api/user/${event.host}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   }
    // });
    // res = await res.json();
    // setHost(res.user.name);

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/organization`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    //setAttending(event.attendees.includes(res.user._id));
  };

  useEffect(() => {
    props.navigation.addListener('focus', fetchEventData);
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
      <Text style={[styles.subText, { fontSize: 20}]}>{description}</Text>
    </View>
  </SafeAreaView>
  );
};

export default ViewOrg;