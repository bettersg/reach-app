/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { RootStackParamList } from '@types';

// Pages
import Home from '@pages/Home';
import EventDetails from '@pages/EventDetails';
import Scanner from '@pages/Scanner';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Scanner" component={Scanner} options={{ title: 'Oops!' }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
