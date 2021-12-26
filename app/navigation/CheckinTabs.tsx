import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Scanner from '@root/pages/Scanner';
import { createStackNavigator } from '@react-navigation/stack';
import ManualInput from '@root/pages/ManualInput';
import CheckinWithContactDetails from '@root/pages/CheckinWithContactDetails';


const NricStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }: { route: any}) => ({
  tabBarIcon: ({ focused }: {focused: boolean}) => {
    const icon = (route.name === 'STUDENT PASS / NRIC' && focused) ? require('@root/assets/images/lines-blue.png') :
              (route.name === 'STUDENT PASS / NRIC' && !focused) ? require('@root/assets/images/lines-grey.png') :
              (route.name === 'CONTACT DETAILS' && focused) ? require('@root/assets/images/contact-phone-blue.png') :
              require('@root/assets/images/contact-phone-grey.png');
    return <Image source={icon} />;
  },
});

function Nric() {
  return (
  <NricStack.Navigator>
    <NricStack.Screen name="ManualInput" component={ManualInput} options={{ headerShown: false }} />
    <NricStack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }}/>
  </NricStack.Navigator>);
}

export default function CheckinTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="STUDENT PASS / NRIC" component={Nric} options={{ headerShown: false }}/>
      <Tab.Screen name="CONTACT DETAILS" component={CheckinWithContactDetails} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
