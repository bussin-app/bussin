import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Search from "../Screens/Search";
import viewUserProfile from "../Screens/viewUserProfile";
import ViewEvent from "../Screens/ViewEvent";
import ViewOrg from "../Screens/ViewOrg";
import Report from "../Screens/Report";
import friendEventList from "../Screens/friendEventList";

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

            <Stack.Screen
                name="ViewOrg"
                component={ViewOrg}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Report"
                component={Report}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="friendEventList"
                component={friendEventList}
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