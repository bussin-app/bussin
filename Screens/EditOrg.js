import React, { useEffect, useState } from "react";
import { View, Text, Button, LogBox, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditOrg = (props) => {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    let organization = props.route.params.item;

    useEffect(() => {
        setName(organization.name);
    }, [organization]);

    const createDeleteAlert = () =>
        Alert.alert(
            "Delete Event",
            "You will not be able to recover this event.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: deleteOrg }
            ],
            { cancelable: false }
        );

    const deleteOrg = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        let res = await fetch(`https://bussin.blakekjohnson.dev/api/organization/${organization._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 200)
            props.navigation.navigate('Event');
        res = await res.json();
        setError(res.msg);
    };

    const updateOrg = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        let res = await fetch(`https://bussin.blakekjohnson.dev/api/organization/${organization._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ update: { name } })
        });
        // Construct data for backend
        if (res.status == 200)
            props.navigation.navigate('Event');
        res = await res.json();
        setError(res.msg);
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Edit Organization"}>
                {
                    error && 
                    <View>
                        <Text>{error}</Text>
                    </View>
                }
                <Input
                    placeholder={"Enter Name of Organization"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <View style={{ marginTop: 50 }}>
                    <Button title={"Save"} onPress={updateOrg} />
                    <Button title='Delete Organization' onPress={createDeleteAlert} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default EditOrg;