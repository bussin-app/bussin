import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewOrg = (props) => {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [following, setFollowing] = useState(true);

  const fetchOrgData = async () => {
    let { organization } = props.route.params;
    setName(organization.name);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;
    //setHost(organization.host.ref.name);

    res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    setFollowing(organization.following.includes(res.user._id));
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
    // add stuff to fill up the follower list
    res = await res.json();
    setFollowing(true);
    setFollowingCount(followingCount + 1);
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
    <View style={[styles.infoContainer, {alignContent: 'start'}]}>
      <Text style={[styles.text, { fontSize: 20}]}>Host: {host}</Text>
      <Button style={[styles.text, { fontSize: 20}]} title='Follow' onPress={follow} />
    </View>
  </SafeAreaView>
  );
};

export default ViewOrg;