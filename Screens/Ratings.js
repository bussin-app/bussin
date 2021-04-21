import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";

const Ratings = (props) => {
  const [event, setEvent] = useState("");
  const [ratings, setRatings] = useState("");

  const fetchData = async () => {
    let { event } = props.route.params;
    setEvent(event);
  };
  useEffect(() => {
    props.navigation.addListener("focus", fetchData);
  }, []);

  createRating(() => {
      
  })

  return (
    <SafeAreaView>
      <NumericInput
        onChange={(value) => setRatings(value)}
        value={"rating from 1-5"}
        rounded
        borderColor={"#B92126"}
        minValue={"1"}
      />

      <Button title={"submit rating"} onPress={createRating} />
    </SafeAreaView>
  );
};

export default Ratings;
