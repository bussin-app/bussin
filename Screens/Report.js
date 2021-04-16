import React, { useState } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { Picker } from '@react-native-community/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Report = (props) => {
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    let { user } = props.route.params;

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Send Report"}>
                <Text style = {{fontFamily: 'HelveticaNeue', fontSize: 15}}>{user.name}</Text>
                <Picker
                    style={{ height: 200, width: 300 }}
                    selectedValue={type}
                    onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                >
                    <Picker.Item label="Spam" value="spam" />
                    <Picker.Item label="Fake/Catfish" value="fake/catfish" />
                    <Picker.Item label="Offensive" value="offensive" />
                </Picker>
                <Input
                    placeholder={"Enter Description"}
                    name={"description"}
                    id={"description"}
                    onChangeText={(text) => setDescription(text)}
                />
                <View style={{ marginTop: 200 }}>
                    <Button title={"Submit"} onPress={() => console.log("Submit")}/>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Report;