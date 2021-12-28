import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CheckinWithContactDetails from '@root/pages/CheckinWithContactDetails';
import CheckinWithNric from '@root/pages/CheckinWithNric';

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

export default function CheckinTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="STUDENT PASS / NRIC" component={CheckinWithNric} options={{ headerShown: false }}/>
      <Tab.Screen name="CONTACT DETAILS" component={CheckinWithContactDetails} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
