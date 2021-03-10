import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import ModifyAcc from '../Screens/ModifyAcc';
import EditPassword from '../Screens/EditPassword';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Settings"
                component={ModifyAcc}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="EditPassword"
                component={EditPassword}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function SettingsNavigator() {
    return <MyStack />
}
