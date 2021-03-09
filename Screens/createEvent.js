import React, { useState, Component } from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Event = (props) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);

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
            date: dateData,
            private: true,
        };

        // Send the request
        let token = await AsyncStorage.getItem('@bussin-token');
        let res = await fetch('https://bussin.blakekjohnson.dev/api/event/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventData
            }),
        });

        // Accept the response
        res = await res.json();
        console.log(res);

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
                    placeholder={"Enter Location"}
                    name={"location"}
                    id={"location"}
                    onChangeText={(text) => setLocation(text)}
                />
                <Text>Enter Date Below</Text>
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
                <View >
                    <Text>Number of Attendees</Text>
                    <NumericInput
                        onChange={value => setMaxAttendees(value)}
                        value={maxAttendees}
                        rounded borderColor={'#B92126'} />

                </View>
                <View style={{ marginTop: 30 }}>
                    <Button title={"Create"} onPress={createEvent} />
                    <Button title={"Back"} onPress={
                        () => props.navigation.navigate("Event")}>
                    </Button>

                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Event;