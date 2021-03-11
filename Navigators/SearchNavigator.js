import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Search from "../Screens/Search";
import viewUserProfile from "../Screens/viewUserProfile";
import ViewEvent from "../Screens/ViewEvent";

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="Search"
                component={Search}
                options={{
                    headerShown: false
                }}
            />


            <Stack.Screen
                name="viewUserProfile"
                component={viewUserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="ViewEvent"
                component={ViewEvent}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
};

export default function SearchNavigator() {
    return <MyStack />
};