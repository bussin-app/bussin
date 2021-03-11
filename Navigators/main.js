import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

// Stacks

import UserNavigator from "./UserNavigator";
import EventNavigator from "./EventNavigator";
import AuthGlobal from "../Context/store/AuthGlobal";
import SearchNavigator from "./SearchNavigator";

const Tab = createBottomTabNavigator();

const Main = () => {

  const context = useContext(AuthGlobal)

  return (
    <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: '#B92126',
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
        component={SearchNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Events"
        component={EventNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="list-ul" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;