import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "../Shared/DatePicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindFriends = (props) => {


    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Register"}></FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default FindFriends;
