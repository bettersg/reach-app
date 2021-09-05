import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@pages/Home';
import Scanner from '@pages/Scanner';
import EventDetails from '@pages/EventDetails';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ title: 'REACH' }} />
      <Stack.Screen name="Scanner" component={Scanner} options={{ title: 'Scanner', headerShown: false }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: 'Check-ins' }} />
    </Stack.Navigator>
  );
}
