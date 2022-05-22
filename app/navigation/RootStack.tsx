import React, {useContext, useEffect, useState} from 'react';
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
import { AuthenticatedUserContext } from './providers/AuthenticatedUserProvider';
import { LoadingView } from '@root/components';
import AuthStack from './AuthStack';
import { setUid } from './uidHolder';
import ProgramSelect from '@root/pages/ProgramSelect';

const {auth} = initFirebase();
const Stack = createStackNavigator();

export default function RootStack() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  
  // useEffect(() => {
  //   (async () => await auth.signInWithEmailAndPassword('any_email@gmail.com', 'anypassword'))();
  // }, []);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    // auth.signOut(); // Used for quick debug
    const unsubscribeAuth = auth.onAuthStateChanged(async authenticatedUser => {
      try {
        const newUid = authenticatedUser?.uid;
        if (newUid) setUid(newUid);
        if (setUser) setUser(authenticatedUser);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  return isLoading ? <LoadingView/> : (
    <NavigationContainer>
        {user ? (
        <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="ProgramSelect" component={ProgramSelect} options={{ headerShown: false }} />
        <Stack.Screen name="CheckinTabs" component={CheckinTabs} options={{ headerShown: false }}/>
        <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
        <Stack.Screen name="SuccessfulCheckin" component={SuccessfulCheckin} options={{ headerShown: false }} />
        <Stack.Screen name="CheckinWithNric" component={CheckinWithNric} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileRegistration" component={ProfileRegistration} options={{ headerShown: false }} />
        <Stack.Screen name="ScannerFromCheckin" component={ScannerFromCheckin} options={{ headerShown: false }} />
        <Stack.Screen name="ScannerFromRegistration" component={ScannerFromRegistration} options={{ headerShown: false }} />
      </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
