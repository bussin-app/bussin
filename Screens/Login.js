import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
//import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //Added for google signin
  /*
  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);
  */
  useEffect(() => {
    redirectIfLoggedIn(props);
  }, [props]);

  const redirectIfLoggedIn = async (props) => {
    let token = await AsyncStorage.getItem('@bussin-token');

    if (!token) return;

    props.navigation.reset({
      index: 0,
      routes: [
        { name: 'User Profile' }
      ]
    });
  };

  const sendRequest = async () => {
    // Construct user data for request
    let body = {
      username,
      password
    };
    // Send request to server and await response
    let res = await fetch("https://bussin.blakekjohnson.dev/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Reject if status is anything other than 200
    if (res.status !== 200) {
      let data = await res.json();
      console.log(data);
      return;
    }

    // Convert response to a JSON object
    let data = await res.json();

    await AsyncStorage.setItem('@bussin-token', data.token);

    props.navigation.reset({
      index: 0,
      routes: [
        { name: 'User Profile' }
      ]
    });
  };
  /*
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setloggedIn(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '418977770929-g9ou7r9eva1u78a3anassxxxxxxx.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };
  */

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Login"}>

        <Input
          placeholder={"Enter Username"}
          name={"username"}
          id={"username"}
          onChangeText={(text) => setUsername(text)}
        />

        <Input
          placeholder={"Enter Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />

        <View>
          <Button title={"Login"} onPress={sendRequest} />
          {/*
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={console.log("Signin with Google")}
          />
          */
          }
        </View>
        <View>
          <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue' }} >Don't have an account yet?</Text>
          <Button title={"Register"} onPress={
            () => props.navigation.navigate("Register")
          }></Button>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

export default Login;
