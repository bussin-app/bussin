import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditPassword = (props) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async () => {
        setWaiting(true);
        setError(null);

        // Construct user data for request
        let body = {
            currentPassword,
            newPassword,
        };

        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        // Send request to server and await response
        let res = await fetch("https://bussin.blakekjohnson.dev/api/user/passwordReset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });

        // Reject if status is anything other than 200
        if (res.status !== 200) {
            let data = await res.json();
            setError(data.msg);
            setWaiting(false);
            return;
        }

        // Convert response to a JSON object
        let data = await res.json();

        setPasswordChanged(true);
    };

    useEffect(() => {
        if (passwordChanged) {
            setWaiting(false);
            setPasswordChanged(false);

            props.navigation.reset({
                index: 0,
                routes: [
                    { name: 'Settings' }
                ]
            });
        }
    }, [passwordChanged]);

    useEffect(() => {
        props.navigation.addListener('focus', () => {
            setNewPassword("");
            setCurrentPassword("");
        });
    }, []);

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Change Password"}>
                {error ? <Text>{error}</Text> : <></>}
                <Input
                    placeholder={"Old Password"}
                    name={"old Password"}
                    secureTextEntry={true}
                    id={"oldPassword"}
                    secureTextEntry={true}
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                    type='password'
                />

                <Input
                    placeholder={"New Password"}
                    name={"new Password"}
                    secureTextEntry={true}
                    id={"newPassword"}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
                <View>
                    <Button title={"Save"} onPress={sendRequest} disabled={waiting} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default EditPassword;