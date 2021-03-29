import React, { useState } from "react";
import { View, Text, Button, LogBox } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";
import { Picker } from '@react-native-community/picker';

import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreLogs(['Warning:']);

const Organization = (props) => {
    const [orgName, setName] = useState("");


    const createOrg = async () => {
        // Construct data for backend
        let body = {
            orgName
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
                Organization: body
            }),
        });

        // Accept the response
        res = await res.json();
        console.log(res);

        //props.navigation.navigate('Organization');
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
                name={"name"} id={"orgName"} 
                value={orgName} 
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