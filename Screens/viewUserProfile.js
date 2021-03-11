import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const UserProfile = (props) => {
  let { user } = props.route.params;
  return (
    <View>
      <Text>Name: {user.name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Gender: {user.gender}</Text>
    </View>
  );

};

export default UserProfile;
