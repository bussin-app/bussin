import React, { useEffect, useState } from 'react';
import { Image, View, Platform , Button, Text, Alert, TouchableOpacity} from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Picker from '@react-native-picker/picker';


const Report = (props) => {
    const [type, setType] = useState("");

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <Picker
                selectedValue={type}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                <Picker.Item label="Offensive" value= "offensive" />
                <Picker.Item label="Spam" value= "spam" />
                <Picker.Item label="Misleading" value= "misleading" />
                <Picker.Item label="Impersonation/Catfish" value= "impersonation" />
            </Picker>
        </KeyboardAwareScrollView>
    )
}

export default Report;