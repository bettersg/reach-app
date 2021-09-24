import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@root/pages/Home';
import Scanner from '@root/pages/Scanner';
import EventDetails from '@root/pages/EventDetails';
import History from '@root/pages/History';

const Stack = createStackNavigator();

export default function CheckinStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
}
