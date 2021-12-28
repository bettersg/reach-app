import React, {useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '@root/pages/Home';
import History from '@root/pages/History';
import SuccessfulCheckin from '@root/pages/SuccessfulCheckin';
import CheckinTabs from './CheckinTabs';
import { initFirebase } from '@root/utils/initFirebaseApp';
import ProfileRegistration from '@root/pages/ProfileRegistration';
import ScannerFromCheckin from '@root/pages/Scanner/fromCheckin';
import ScannerFromRegistration from '@root/pages/Scanner/fromRegistration';
import CheckinWithNric from '@root/pages/CheckinWithNric';

const {auth} = initFirebase();
const Stack = createStackNavigator();

export default function RootStack() {
  useEffect(() => {
    (async () => await auth.signInWithEmailAndPassword('any_email@gmail.com', 'anypassword'))();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="CheckinTabs" component={CheckinTabs} options={{ headerShown: false }}/>
        <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
        <Stack.Screen name="SuccessfulCheckin" component={SuccessfulCheckin} options={{ headerShown: false }} />
        <Stack.Screen name="CheckinWithNric" component={CheckinWithNric} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileRegistration" component={ProfileRegistration} options={{ headerShown: false }} />
        <Stack.Screen name="ScannerFromCheckin" component={ScannerFromCheckin} options={{ headerShown: false }} />
        <Stack.Screen name="ScannerFromRegistration" component={ScannerFromRegistration} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
