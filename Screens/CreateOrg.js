import React, { useState } from "react";
import { View, Alert, Button, LogBox } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";

import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreLogs(['Warning:']);

const Organization = (props) => {
    const [name, setName] = useState("");

    const createAlert = () =>
        Alert.alert(
            "Your Organization has been created!",
            [
                { text: "Done" }
            ],
            { cancelable: true }
        );
    const createOrg = async () => {
        // Construct data for backend
        let OrgData = {
            name
        };

        // Send the request
        let token = await AsyncStorage.getItem('@bussin-token');
        let res = await fetch('https://bussin.blakekjohnson.dev/api/organization/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                organization: OrgData
            }),
        });
        
        // Accept the response
        res = await res.json();
        createAlert;
      //console.log(res);
        props.navigation.navigate('User Profile');
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Create Organization"}>
            <Input 
                placeholder={"name"} 
                name={"name"} id={"name"} 
                value={name} 
                onChangeText={(text) => setName(text)} 
            />
            <View style={{}}>
                <Button title={"Create"} onPress={createOrg} />
            </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Organization;