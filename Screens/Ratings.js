import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from 'react-native-numeric-input';



const Ratings = (props) => {
  const [event, setEvent] = useState("");
  const [ratings, setRatings] = useState(0);
  const [eventID, setEventID] = useState(0);

  const fetchData = async () => {
    let { event } = props.route.params;
    setEvent(event);
    setEventID(event._id);
  };
  useEffect(() => {
    props.navigation.addListener("focus", fetchData);
  }, []);

  const submitRating = async () => {
    try {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;
        let res = await fetch(`https://bussin.blakekjohnson.dev/api/event/rate/${eventID}`, {
            method: 'PATCH',
            body: JSON.stringify({ rating: ratings }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(res.status);
        props.navigation.navigate('ViewEvent', {event});
    } catch (e) { console.error(e); return; }
    
  }
  

  return (
    <SafeAreaView>
      <NumericInput
        onChange={(value) => setRatings(value)}
        value={ratings}
        rounded
        borderColor={"#B92126"}
        minValue={"0"}
      />
      

      <Button title={"submit rating"} onPress={submitRating}/>
    </SafeAreaView>
  );
};

export default Ratings;
