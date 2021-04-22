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

  const styles = StyleSheet.create({
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    }
  });

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
    <SafeAreaView style={{alignItems: 'center'}}>
       <Text style={{ fontFamily: "HelveticaNeue", fontSize: 36, marginTop: 5, fontWeight: "200"}}>Rate Event</Text>
       <Text style={[styles.text, { fontSize: 20 }]}>{event.name}</Text>
      <View style={{marginTop: 20, marginBottom: 10}}>
        <NumericInput
        onChange={(value) => setRatings(value)}
        value={ratings}
        rounded
        borderColor={"#B92126"}
        minValue={"0"}
        maxValue={"5"}
      />
      </View>
      
      

      <Button title={"Submit"} onPress={submitRating}/>
    </SafeAreaView>
  );
};

export default Ratings;
