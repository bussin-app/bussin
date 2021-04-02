import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";

import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
