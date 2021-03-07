import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// Stacks

import UserNavigator from "./UserNavigator";
import AuthGlobal from "../Context/store/AuthGlobal";
import Search from "../Screens/Search";
import Settings from "../Screens/Settings";
import Events from "../Screens/Events";

const Tab = createBottomTabNavigator();

const Main = () => {

const context = useContext(AuthGlobal)
  
  return (
    <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="plus" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="cog" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;