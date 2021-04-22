import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './Shared/Header';
import Main from './Navigators/main';
import { NavigationContainer } from "@react-navigation/native";

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyATfrCn6J8r-wzSq2Eb78rT0844o4dBn1c",
  authDomain: "bussin-9e697.firebaseapp.com",
  projectId: "bussin-9e697",
  storageBucket: "bussin-9e697.appspot.com",
  messagingSenderId: "92611639381",
  appId: "1:92611639381:web:80232d8b8c2a3630f27cdc",
};

firebase.initializeApp(firebaseConfig);

// test
export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Main />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
