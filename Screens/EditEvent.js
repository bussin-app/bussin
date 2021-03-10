import React, { useState } from "react";
import { View, Text, Button, LogBox } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";
import { Picker } from '@react-native-community/picker';

const EditEvent = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);
    const [status, setStatus] = useState("");


    const onDateChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setDate(event);
    };

    const onTimeChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setTime(event);
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Edit Event"}>
                <Input
                    placeholder={"Enter Name of Event"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text)}
                />

                <Input
                    placeholder={"Enter Description"}
                    name={"description"}
                    id={"description"}
                    onChangeText={(text) => setDiscription(text)}
                />
            </FormContainer>

            <View style={{ marginTop: 220 }}>
                {show && (
                    <DatePicker
                        date={date}
                        mode="date"
                        onChange={onDateChange}
                    />
                )}
            </View>
            <View style={{ marginTop: 220 }}>
                {show && (
                    <TimePicker
                        time={time}
                        mode="time"
                        onChange={onTimeChange}
                    />
                )}
            </View>
            <FormContainer>
                <View style={{ alignItems: 'center' }}>
                    <Text>Number of Attendees</Text>
                    <NumericInput
                        onChange={value => setMaxAttendees(value)}
                        value={maxAttendees}
                        rounded borderColor={'#B92126'} />
                    <Picker
                        style={{ height: 50, width: 300 }}
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                    >
                        <Picker.Item label="Public" value="public" />
                        <Picker.Item label="Private" value="private" />
                    </Picker>
                </View>
                <View style={{ marginTop: 200 }}>
                    <Button title={"Save"}/>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default EditEvent;