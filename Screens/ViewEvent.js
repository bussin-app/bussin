import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewEvent = (props) => {

  return (
    <View>
      <Text>Name: </Text>
      <Text>Description: </Text>
      <Text>Number of Attendees: </Text>
      <Text>Host: </Text>
      <Text>Time: </Text>
      <Text>Date: </Text>
    </View>
  );
  
};

export default ViewEvent;