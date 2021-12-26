import React, {useContext, useCallback} from 'react';
import { Text, View } from 'react-native';
import { SolidButton } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import {commonStyles} from '@root/commonStyles';
import ContactDetailsInput from '@root/components/ContactDetailsInput';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function CheckinWithContactDetails({ navigation }: Props) {
  const { event, firstName, lastName, phone, idHash } = useContext(EventContext);

  const handleOnCheckIn = useCallback(async () => {
    if (firstName && lastName && phone) {
      navigation.navigate('ProfileRegistration', { needsNric: true });
    }
  }, [firstName, lastName, event, phone]);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Enter your name and contact details</Text>
      </View>
      <ContactDetailsInput/>
      <View style={commonStyles.thickPad}>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
      <View style={{flex: 3}}/>
    </ContentFrame>
  );
}
