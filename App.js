import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './Shared/Header';
import Main from './Navigators/main';
import { NavigationContainer } from "@react-navigation/native";

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
