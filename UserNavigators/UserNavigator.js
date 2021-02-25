import React from "react"
import { createStackNavigator } from '@react-navigation/stack'

import Register from '../Screens/Register'
import UserProfile from '../Screens/UserProfile'

const Stack = createStackNavigator();

function MyStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
              name="Register"
              component ={Register}
              options = {{
                  headerShown: false
              }}
            />

            <Stack.Screen
              name="User Profile"
              component ={UserProfile}
              options = {{
                  headerShown: false
              }}
            />
       </Stack.Navigator>
    )
}

export default function UserNavigator() {
    return <MyStack />
}
