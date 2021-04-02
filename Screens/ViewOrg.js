import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewOrg = (props) => {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [following, setFollowing] = useState(true);

  const fetchOrgData = async () => {
    let { organization } = props.route.params;
    setName(organization.name);
    setFollowingCount(organization.attendees || 0);

    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;
    //setHost(organization.host.ref.name);

    let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res = await res.json();
    setFollowing(res.user.followedOrganizations.includes(organization._id));
  };

  const follow = async () => {
    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    let { organization } = props.route.params;

    let res;
    try {
      res = await fetch(`https://bussin.blakekjohnson.dev/api/organization/follow/${organization._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      res = await res.text();
    } catch (e) {
      console.error(e);
      return;
    }
    console.log(res);
    // add stuff to fill up the follower list
    setFollowing(true);
    setFollowingCount(followingCount + 1);
  };

  const unfollow = async () => {
    let token = await AsyncStorage.getItem('@bussin-token');
    if (!token) return;

    let { organization } = props.route.params;

    let res;
    try {
      res = await fetch(`https://bussin.blakekjohnson.dev/api/organization/unfollow/${organization._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      res = await res.text();
    } catch (e) {
      console.error(e);
      return;
    }
    console.log(res);
    // add stuff to fill up the follower list
    setFollowing(false);
    setFollowingCount(followingCount - 1);
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
      <View style={styles.statsContainer}>
        <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24 }]}>{followingCount}</Text>
          <Text style={[styles.text, styles.subText]}>Followers</Text>
        </View>
        <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24 }]}>{host}</Text>
          <Text style={[styles.text, styles.subText]}>Hosted by</Text>
        </View>
      </View>
      <View style={[styles.infoContainer, { alignContent: 'start' }]}>
        {
          !following &&
          <Button style={[styles.text, { fontSize: 20 }]} title='Follow' onPress={follow} disabled={following} />
        }
        {
          following &&
          <Button style={[styles.text, { fontSize: 20 }]} title='Unfollow' onPress={unfollow} disabled={!following} />
        }
      </View>
    </SafeAreaView>
  );
};

export default ViewOrg;