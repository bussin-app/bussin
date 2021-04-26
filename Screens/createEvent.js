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

const Event = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);
    const [orgName, setOrgName] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [eventLink, setEventLink] = useState("");
    const [status, setStatus] = useState("");


    const onDateChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setDate(event);
    };

    const onTimeChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setTime(event);
    };

    const createEvent = async () => {
        // Construct the date based on time and date
        let dateData = new Date(date);
        dateData.setHours(time.getHours());
        dateData.setMinutes(time.getMinutes());
        dateData.setSeconds(time.getSeconds());

        // Construct data for backend
        let eventData = {
            name,
            maxAttendees,
            description,
            private: (status == 'private'),
            date: dateData,
            url: eventLink,
        };

        let body = {
            event: eventData
        };

        if (orgName.length > 0) {
            body.organizationName = orgName;
        }

      //console.log('ADDDRESSS SS S :', eventAddress);
        if (eventAddress.length > 0) {
            body.address = eventAddress;
        }
        if (eventLink.length > 0) {
            body.link = eventLink;
        }
        // eventLink
      //console.log(body);

        // Send the request
        let token = await AsyncStorage.getItem('@bussin-token');
        let res = await fetch('https://bussin.blakekjohnson.dev/api/event/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Accept the response
        res = await res.json();

        props.navigation.navigate('Event');
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Create Event"}>
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
                    onChangeText={(text) => setDescription(text)}
                />                
                <Input
                    placeholder={"Optional: Organization Name"}
                    name={"orgName"}
                    id={"orgName"}
                    onChangeText={(text) => setOrgName(text)}
                />
                <Input
                    placeholder={"Optional: Address"}
                    name={"eventAddress"}
                    id={"eventAddress"}
                    onChangeText={(text) => setEventAddress(text)}
                />
                <Input
                    placeholder={"Optional: A Link"}
                    name={"eventLink"}
                    id={"eventLink"}
                    onChangeText={(text) => setEventLink(text)}
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
                        rounded borderColor={'#B92126'}
                        minValue={'1'} />
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
                    <Button title={"Create"} onPress={createEvent} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Event;