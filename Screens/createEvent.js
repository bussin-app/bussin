import React, {useState, Component} from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import TimePicker from "../Shared/TimePicker";

const Event = (props) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date(1598051730000));
    const [time, setTime] = useState(new Date(1598051730000));
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(1);

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
        <View >
            <Text>Number of Attendees</Text>
            <NumericInput onChange={value => console.log(value)} rounded borderColor = {'#B92126'} />
            
        </View>
        <View style = {{marginTop: 30}}>
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