import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

//Need to import data of the friendship status
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#FFF"
  },
  text: {
      fontFamily: "HelveticaNeue",
      color: "#52575D"
  },
  image: {
      flex: 1,
      height: undefined,
      width: undefined
  },
  titleBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
      marginHorizontal: 16,
      marginLeft: 390
  },
  subText: {
      fontSize: 12,
      color: "#AEB5BC",
      textTransform: "uppercase",
      fontWeight: "500"
  },
  profileImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#000000"
  },
  dm: {
      backgroundColor: "#FFFFFF",
      position: "absolute",
      top: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#000000"
      
  },
  active: {
      backgroundColor: "#34FFB9",
      position: "absolute",
      bottom: 28,
      left: 10,
      padding: 4,
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#000000"
  },
  add: {
      backgroundColor: "#FFFFFF",
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#000000"
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

const UserProfile = (props) => {
  let { user } = props.route.params;

  const addFriendAlert = () =>
        Alert.alert(
            "Add Friend",
            "Do you want to add this user as a friend?",
            [
                {
                    text: "Cancel",
                    onPress: () => { 
                        console.log("Cancel Pressed");
                    },
                    style: "cancel"
                },
                { text: "Confirm", onPress: addFriend }
            ],
            { cancelable: false }
        );
  
  const addFriend = async () => {
   let token = await AsyncStorage.getItem('@bussin-token');
   if (!token) return;

   let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   res = await res.json();
   //TODO: Update user fetch link
   res = await fetch('https://bussin.blakekjohnson.dev/api/friends/', {
     method: 'POST',
     body: JSON.stringify({
       //TODO: Update fields
       to: 123, // How to get current user's id?
       from: res.user._id,
     }),
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });

   if (res.status != 200) return;
 };
  return (
    <SafeAreaView style={styles.container}>
        {user && <>
          <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.titleBar}>
              </View>
              <View style={{ alignSelf: "center" }}>
                  <View style={styles.profileImage}>
                      <Image source={require("../Assets/logo1.png")} style={styles.image} resizeMode="center"></Image>
                  </View>
                  <View style={styles.add}>
                      <Icon name="plus" size={30} color="#B92126" style={{ marginTop: 6, marginLeft: 2 }} onPress = {addFriendAlert}></Icon>
                  </View>
              </View>
              <View style={styles.infoContainer}>
                  <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{user.name}</Text>
                  <Text style={[styles.text, { color: "#AEB5BC", fontSize: 20 }]}>{user.username}</Text>
              </View>

              <View style={styles.statsContainer}>
                  <View style={styles.statsBox}>
                      <Text style={[styles.text, { fontSize: 24 }]}>{user.eventPoints}</Text>
                      <Text style={[styles.text, styles.subText]}>Bussin Score</Text>
                  </View>
                  <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                      <Text style={[styles.text, { fontSize: 24 }]}>23</Text>
                      <Text style={[styles.text, styles.subText]}>Events Hosted</Text>
                  </View>
                  <View style={styles.statsBox}>
                      <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
                      <Text style={[styles.text, styles.subText]}>Friends</Text>
                  </View>
              </View>
          </ScrollView>
          </>
        }
      </SafeAreaView>
  );

};

export default UserProfile;
