import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import CreateEvent from '../Screens/createEvent';
import Event from '../Screens/Event';
import EditEvent from '../Screens/EditEvent';
import EditOrg from '../Screens/EditOrg';
import FriendList from '../Screens/FriendList';
import OrgMemberList from '../Screens/OrgMemberList';
import ViewEvent from '../Screens/ViewEvent';
import Ratings from '../Screens/Ratings';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="Event"
                component={Event}
                options={{
                    headerShown: false
                }}
            />


            <Stack.Screen
                name="CreateEvent"
                component={CreateEvent}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="EditEvent"
                component={EditEvent}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="EditOrg"
                component={EditOrg}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="FriendList"
                component={FriendList}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="OrgMemberList"
                component={OrgMemberList}
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
                name="Ratings"
                component={Ratings}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    )
}

export default function EventNavigator() {
    return <MyStack />
}