import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateOrg = (props) => {
    const [name, setName] = useState("");
    const [waiting, setWaiting] = useState(false);
    //const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async () => {
        setWaiting(true);
        setError(null);

        // Construct user data for request
        let body = {
            name,
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

        //setPasswordChanged(true);
    };

    // useEffect(() => {
    //     if (passwordChanged) {
    //         setWaiting(false);
    //         setPasswordChanged(false);

    //         props.navigation.reset({
    //             index: 0,
    //             routes: [
    //                 { name: 'User Profile' }
    //             ]
    //         });
    //     }
    // }, [passwordChanged]);

    useEffect(() => {
        props.navigation.addListener('focus', () => {
            setName("");
        });
    }, []);

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Create Organization"}>
                {error ? <Text>{error}</Text> : <></>}
                <Input
                    placeholder={"name"}
                    name={"name"}
                    id={"name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <View>
                    <Button title={"Next"} onPress={sendRequest} disabled={waiting} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default CreateOrg;