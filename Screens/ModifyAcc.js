import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ModifyAcc = (props) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [accountChanged, setAccountChanged] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const sendRequest = async () => {
        setWaiting(true);
        // Construct user data for request
        let user = {
        };
        if (username != '') user.username = username;
        if (name != '') user.name = name;

        // Get token
        let token = await AsyncStorage.getItem('@bussin-token');

        if (!token) return;

        // Send request to server and await response
        let res = await fetch("https://bussin.blakekjohnson.dev/api/user", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                update: user,
            })
        });

        // Reject if status is anything other than 200
        if (res.status !== 200) {
            let data = await res.json();
            console.log(data);
            return;
        }

        setAccountChanged(true);
    };

    useEffect(() => {
        props.navigation.addListener('focus', () => {
            setName("");
            setUsername("");
        });
    }, []);

    useEffect(() => {
        if (accountChanged) {
            setWaiting(false);
            setAccountChanged(false);

            props.navigation.navigate('User Profile');
        }
    }, [accountChanged]);

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Modify Account"}>
                <Input
                    placeholder={"Change name"}
                    name={"name"}
                    id={"name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />

                <Input
                    placeholder={"Change username"}
                    name={"username"}
                    id={"username"}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                <View>
                    <Button title={"Save"} onPress={sendRequest} disabled={waiting} />
                    <Button title={"Upload Photo"}/>
                </View>
                <View>
                    <Button title={"Change Password"} disabled={waiting} onPress={
                        () => props.navigation.navigate("EditPassword")}>
                    </Button>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default ModifyAcc;