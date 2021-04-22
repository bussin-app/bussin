import React, { useState } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { Picker } from '@react-native-community/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";


const FindFriends = () => {

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Find Friends"}>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default FindFriends;
