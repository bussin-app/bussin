import React, { useEffect, useState } from "react";
import { View, Text, Button, LogBox, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";
import { Picker } from '@react-native-community/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditEvent = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [eventID, setEventID] = useState(null);


    const onDateChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setDate(event);
    };

    const onTimeChange = (event, _) => {
        setShow(Platform.OS === 'ios');
        setTime(event);
    };

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
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        let res = await fetch(`https://bussin.blakekjohnson.dev/api/event/${eventID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(res);
        if (res.status != 200) return;

        props.navigation.navigate('Event');
    };

    const updateEvent = async () => {
        // Construct the date based on time and date
        let dateData = new Date(date);
        let timeData = new Date(time);
        dateData.setHours(timeData.getHours());
        dateData.setMinutes(timeData.getMinutes());
        dateData.setSeconds(timeData.getSeconds());

        // Construct data for backend
        let update = {
            name,
            maxAttendees,
            description,
            private: (status == 'private'),
            date: dateData,
        };

        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;
        let res;
        try {
            res = await fetch(`https://bussin.blakekjohnson.dev/api/event/${eventID}`, {
                method: 'PATCH',
                body: JSON.stringify({ update }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        } catch (e) { console.error(e); return; }

        console.log(res.status);

        props.navigation.navigate('Event');
    };

    let { event } = props.route.params;
    useEffect(() => {
        setLoading(true);
        setName(event.name);
        setDescription(event.description);
        setDate(event.date);
        setTime(event.date);
        setMaxAttendees(event.maxAttendees);
        setStatus(event.private ? "private" : "public");
        setEventID(event._id);
    }, [event]);

    useEffect(() => {
        setLoading(false);
    }, [eventID]);

    if (loading) {
        return (
            <KeyboardAwareScrollView
                viewIsInsideTabBar={true}
                extraHeight={200}
                enableOnAndroid={true}>
                <Text>Loading</Text>
            </KeyboardAwareScrollView>
        );
    }

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
                    value={name}
                />

                <Input
                    placeholder={"Enter Description"}
                    name={"description"}
                    id={"description"}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
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
                    <Button title={"Save"} onPress={updateEvent} />
                    <Button title='Delete Event' onPress={createDeleteAlert} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default EditEvent;