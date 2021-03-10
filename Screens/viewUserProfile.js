import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


const UserProfile = (props) => {

  const [profile, setProfile] = useState(null);
  const [fetched, setFetched] = useState(false);

  // TODO: fetch the user data with a specific ID
  // and get the data from the backend
  // set the user profile accordingly
  const fetchProfile = async () => {
    let token = await AsyncStorage.getItem("@bussin-token");
    let res = await fetch("https://bussin.blakekjohnson.dev/api/user/:id", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    console.log(data.user);
    setProfile(data.user);
  };
  useEffect(() => {
    if (!fetched) {
      fetchProfile();
      setFetched(true);
    }
  }, [fetched]);

  // TODO: navigate back to the previous page
  const back = async () => {};
  // if no profile found -> return to previous page
  if (!profile) {
    return (
      <View>
        <Text>cannot find user!</Text>
        <Button title="Back" onPress={back} />
      </View>
    );
  }

  return (
    <View>
      <Text>Name: {profile.name}</Text>
      <Text>Username: {profile.username}</Text>
      <Text>Gender: {profile.gender}</Text>
    </View>
  );
  
};

export default UserProfile;
