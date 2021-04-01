import React, { useEffect, useState } from "react";
import { View, Text, Button, LogBox, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";

const EditOrg = (props) => {
    const [name, setName] = useState("");

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
                { text: "Delete", onPress: deleteEvent }
            ],
            { cancelable: false }
        );

    const deleteEvent = async () => {
        // Deletion linking
    };

    const updateEvent = async () => {
        // Construct data for backend
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Edit Organization"}>
                <Input
                    placeholder={"Enter Name of Organization"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <View style={{ marginTop: 50 }}>
                    <Button title={"Save"} onPress={updateEvent} />
                    <Button title='Delete Organization' onPress={createDeleteAlert} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default EditOrg;