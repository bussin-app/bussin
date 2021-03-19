import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Register from '../Screens/Register';
import Login from '../Screens/Login';
import UserProfile from '../Screens/UserProfile';
import ModifyAcc from '../Screens/ModifyAcc';
import createOrg from '../Screens/CreateOrg';
import EditPassword from '../Screens/EditPassword';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />


            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />

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
            <Stack.Screen
                name="CreateOrg"
                component={createOrg}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
};

export default function UserNavigator() {
    return <MyStack />
};
