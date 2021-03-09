import React from 'react';
import { View, Text, Button } from 'react-native';

const Event = (props) => {
    return (
        <View>
            <Text>Events here!</Text>
            <Button title={"Add Event"} onPress={
                    () => props.navigation.navigate("createEvent")}>
            </Button>
        </View>
    )
}

export default Event;