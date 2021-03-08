import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

// Stacks

import UserNavigator from "./UserNavigator";
import EventNavigator from "./EventNavigator";
import AuthGlobal from "../Context/store/AuthGlobal";
import Search from "../Screens/Search";
import Settings from "../Screens/Settings";
import ModififyAcc from "../Screens/ModifyAcc";
import Events from "../Screens/Events";
import ModifyAcc from "../Screens/ModifyAcc";

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
        component={Search}
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

      <Tab.Screen
        name="Settings"
        component={ModifyAcc}
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