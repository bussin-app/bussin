import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import createEvent from '../Screens/createEvent';
import Event from '../Screens/Event';

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
              name="createEvent"
              component ={createEvent}
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