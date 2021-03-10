import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "../Shared/DatePicker";

import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = (props) => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);

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
        let user = {
            name,
            username,
            email,
            password,
            gender,
        };

        // Modify the date
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        user.birthday = date;

        // Send request to server and await response
        let res = await fetch("https://bussin.blakekjohnson.dev/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user,
            })
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

    const onChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setDate(event);
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Register"}>
                <Input
                    placeholder={"Name"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text)}
                />

                <Input
                    placeholder={"Username"}
                    name={"username"}
                    id={"username"}
                    onChangeText={(text) => setUsername(text)}
                />

                <Input
                    placeholder={"Email"}
                    name={"email"}
                    id={"email"}
                    onChangeText={(text) => setEmail(text)}
                />

                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    placeholder={"Gender"}
                    name={"gender"}
                    id={"gender"}
                    onChangeText={(text) => setGender(text.toUpperCase())}
                />
            </FormContainer>
            <View style={{ marginTop: 220 }}>
                {show && (
                    <DatePicker
                        date={date}
                        mode="date"
                        onChange={onChange}
                    />
                )}
            </View>
            <FormContainer>
                <View>
                    <Button title={"Register"} onPress={sendRequest} />
                </View>
                <View>
                    <Text>Have an account already?</Text>
                    <Button title={"Login"} onPress={
                        () => props.navigation.navigate("Login")}>
                    </Button>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Register;
