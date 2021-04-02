import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Register from "../Screens/Register";
import Login from "../Screens/Login";
import UserProfile from "../Screens/UserProfile";
import ModifyAcc from "../Screens/ModifyAcc";
import OrgFollowing from "../Screens/OrgFollowing";
import CreateOrg from "../Screens/CreateOrg";
import EditPassword from "../Screens/EditPassword";
import FriendList from "../Screens/FriendList";
import pastEvent from "../Screens/pastEvent";
import ViewOrg from "../Screens/ViewOrg";
import viewUserProfile from '../Screens/viewUserProfile';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ViewOrg"
        component={ViewOrg}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="User Profile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="OrgFollowing"
        component={OrgFollowing}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Settings"
        component={ModifyAcc}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EditPassword"
        component={EditPassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateOrg"
        component={CreateOrg}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="FriendList"
        component={FriendList}
        options={{
          headerShown: false,
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
        name="PastEvent"
        component={pastEvent}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return <MyStack />;
}
