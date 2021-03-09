import React from 'react';
import { View, Text, Button } from 'react-native';

const EditEvent = (props) => {
    return (
        <View>
            <Text>Edit Event</Text>
            <Button title={"Cancel"} onPress={
                () => props.navigation.navigate("Event")}>
            </Button>
        </View>
    )
}

export default EditEvent;