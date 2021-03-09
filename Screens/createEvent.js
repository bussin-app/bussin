import React, {useState} from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";
import {Picker} from '@react-native-community/picker';


const Event = (props) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date(1598051730000));
    const [time, setTime] = useState(new Date(1598051730000));
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);
    const [value, setValue] = useState(null);
    const [status, setStatus] = useState("");

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShow(Platform.OS === 'ios');
        setTime(currentTime);
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
                onChangeText={(text) => setName(text.toLowerCase())}
            />

            <Input
                placeholder={"Enter Location"}
                name={"location"}
                id={"location"}
                onChangeText={(text) => setLocation(text)}
            />
            <Text>Enter Date Below</Text>
    </FormContainer>
        
        <View style = {{marginTop: 220}}>
            {show && (
                <DatePicker
                    date={date}
                    mode = "date"
                    onChange={onDateChange}
                />
            )}
        </View>
        <View style = {{marginTop: 220}}>
            {show && (
                <TimePicker
                    time={time}
                    mode = "time"
                    onChange={onTimeChange}
                />
            )}
        </View>
    <FormContainer>
        <View style = {{alignItems: 'center'}} >
            <Text>Number of Attendees</Text>
            <NumericInput onChange={value => console.log(value)} rounded borderColor = {'#B92126'} />
            <Picker
            style={{height: 50, width: 300}}
            selectedValue={status}
            onValueChange = {(itemValue, itemIndex) => setStatus(itemValue)}
            >
            <Picker.Item label="Public" value="public" />
            <Picker.Item label="Private" value="private" />
            </Picker>
        </View>
        <View style = {{marginTop: 200}}>
          <Button title={"Create"}/>
          <Button title={"Back"} onPress={
                () => props.navigation.navigate("Event")}>
          </Button>
          
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
    )
}

export default Event;