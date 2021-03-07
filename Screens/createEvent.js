import React, {useState, Component} from "react";
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import NumericInput from 'react-native-numeric-input';
import DatePicker from "../Shared/DatePicker";
import { Switch } from 'react-native-switch';

const Event = (props) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date(1598051730000));
    const [show, setShow] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(0);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
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

        <View>
            {show && (
                <DatePicker
                    date={date}
                    mode = "date"
                    onChange={onChange}
                />
            )}
        </View>
        <View>
            <NumericInput value={maxAttendees}  />
            <Switch
                value={true}
                onValueChange={(val) => console.log(val)}
                disabled={false}
                activeText={'On'}
                inActiveText={'Off'}
                circleSize={30}
                barHeight={1}
                circleBorderWidth={3}
                backgroundActive={'green'}
                backgroundInactive={'gray'}
                circleActiveColor={'#30a566'}
                circleInActiveColor={'#000000'}
                changeValueImmediately={true}
                changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                outerCircleStyle={{}} // style for outer animated circle
                renderActiveText={false}
                renderInActiveText={false}
                switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
            />
        </View>
        <View>
          <Button title={"Create"}/>
            
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
    )
}

export default Event;