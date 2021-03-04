import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sendRequest = async () => {
    // Construct user data for request
    let user = {
      username,
      password
    };
    // Send request to server and await response
    let res = await fetch("https://bussin.blakekjohnson.dev/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
      }),
    });

    // Reject if status is anything other than 200
    if (res.status !== 200) {
      let data = await res.json();
      console.log(data);
      return;
    }

    // Convert response to a JSON object
    let data = await res.json();
    // Output the token that the server response
    console.log(data.token);

    // TODO: redirect to the user page
    props.navigation.navigate(
      "https://bussin.blakekjohnson.dev/api/user/$USER:id"
    );
  };
  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Register"}>

        <Input
          placeholder={"Username"}
          name={"username"}
          id={"username"}
          onChangeText={(text) => setUsername(text.toLowerCase())}
        />

        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />

        <View>
          <Button title={"Login"} onPress={sendRequest} />
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

export default Login;
