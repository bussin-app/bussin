import React from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text } from 'react-native';

const Header = () => {
  return (
    <SafeAreaView style={styles.header}>
          <Image 
            source = {require("../Assets/logo2.png")}
            resizeMode='contain'
            style={styles.image}
          /> 
    </SafeAreaView>
  )
  }

    const styles = StyleSheet.create({
     header: {
        width: "100%",
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop:20
      },

      image: {
        width: 50,
        height: 50,
        borderRadius: 45,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#000000"
      }
    });

export default Header;