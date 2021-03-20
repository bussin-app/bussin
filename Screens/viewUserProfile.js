import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

//Need to import data of the friendship status
const UserProfile = (props) => {
  let { user } = props.route.params;
  
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
   res = await fetch('https://bussin.blakekjohnson.dev/api/event/markAttendance', {
     method: 'PUT',
     body: JSON.stringify({
       //TODO: Update fields
       userID: res.user._id,
       eventID: eventID,
     }),
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });

   if (res.status != 200) return;
   //Make changes accordingly
   setAttending(true);
   setAttendeeCount(attendeeCount + 1);
 };
  return (
    <View>
      <Text>Name: {user.name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Points: {user.eventPoints}</Text>
      //Implement addFriend method to button
      <Button title={"Add Friend"} onPress={console.log("Add Friend")}/>
    </View>
  );

};

export default UserProfile;
