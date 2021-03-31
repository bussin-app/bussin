import React, { Component, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE} from "react-native-maps";
import { mapStyle } from "../constants/mapStyle.json";

const map = (props) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    let storedToken = await AsyncStorage.getItem("@bussin-token");

    if (!storedToken) {
      setLoading(false);
      setError("To get started login at the user page.");
      return;
    }
    setToken(storedToken);

    try {
      let res = await fetch("https://bussin.blakekjohnson.dev/api/event/nearby", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      res = await res.json();

      setEvents(res.events);
    } catch (e) {
      setError(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setLoading(true);
      setError(null);
      setEvents([]);
      fetchEvents();
    });
  }, []);

  // TODO: link the backend and get a 
  // list of events to display
  const getNearbyEvents = async () => {
  }

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      customMapStyle={mapStyle}
      initialRegion={{
        latitude: 40.43,
        longitude: -86.91,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    />
  );

  
};

export default map;
