import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import CreateEvent from '../Screens/CreateEvent';
import Event from '../Screens/Event';
import EditEvent from '../Screens/EditEvent';

const Stack = createStackNavigator();

function MyStack() {
    return (
       <Stack.Navigator>
           
           <Stack.Screen
              name="Event"
              component ={Event}
              options = {{
                  headerShown: false
              }}
            />
           
           
           <Stack.Screen
              name="CreateEvent"
              component ={CreateEvent}
              options = {{
                  headerShown: false
              }}
            />

            <Stack.Screen
              name="EditEvent"
              component ={EditEvent}
              options = {{
                  headerShown: false
              }}
            />

       </Stack.Navigator>
    )
}

export default function EventNavigator() {
    return <MyStack />
}