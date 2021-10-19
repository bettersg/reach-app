import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@root/pages/Home';
import History from '@root/pages/History';
import ManualInput from '@root/pages/ManualInput';
import SuccessfulCheckin from '@root/pages/SuccessfulCheckin';
import CheckinTabs from './CheckinTabs';
import ProfileRegistration from '@root/pages/ProfileRegistration';

const Stack = createStackNavigator();

export default function VisitStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="CheckinTabs" component={CheckinTabs} options={{ headerShown: false }}/>
      <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
      <Stack.Screen name="SuccessfulCheckin" component={SuccessfulCheckin} options={{ headerShown: false }} />
      <Stack.Screen name="ManualInput" component={ManualInput} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileRegistration" component={ProfileRegistration} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
