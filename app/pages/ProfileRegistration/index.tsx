import React, {useContext, useCallback, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SolidButton, Spacer } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import {commonStyles} from '@root/commonStyles';
import { getExistingNricProfile, registerProfile } from '@root/utils/profiles.datastore';
import moment from 'moment-timezone';
import ContactDetailsInput from '@root/components/ContactDetailsInput';
import NricInput from '@root/components/NricInput';
import { WhitespaceButton } from '@root/components/SolidButton';
import { registerCheckin, registerNameCheckin } from '@root/utils/events.datastore';

type Props = StackScreenProps<RootStackParamList, 'ProfileRegistration'>;

export default function ProfileRegistration({ route, navigation }: Props) {
  const { idHash, firstName, lastName, phone, event } = useContext(EventContext);
  
  const { needsNric } = route.params;
  
  console.log({
    idHash, firstName, lastName, phone, event
  });

  useEffect(() => {
    (async () => {
      const existingProfile = idHash ? await getExistingNricProfile(idHash) : undefined;
      if (existingProfile !== undefined) {
        await registerCheckin(idHash!, event!);
        navigation.navigate('SuccessfulCheckin');
      }
    })();
  }, [idHash, event]);

  const handleOnSubmit = useCallback(async () => {
    if (firstName && lastName && phone && event && idHash) {
        await registerProfile({
            idHash,
            firstName,
            lastName,
            phone,
            createdAt: moment().unix(),
        });
        await registerCheckin(idHash, event!);
        navigation.navigate('SuccessfulCheckin');
    }
  }, [firstName, lastName, event, phone, idHash]);

  const handleOnSkip = useCallback(async () => {
    await registerNameCheckin(`${firstName} ${lastName}`, phone!, event!);
    navigation.navigate('SuccessfulCheckin');
  }, [firstName, lastName, phone, event]);

  return needsNric ? (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>We noticed that you&apos;re new here!</Text>
        <Text style={commonStyles.actionText}>Enter your NRIC</Text>
      </View>
      <Spacer/>
      <NricInput/>
      <View style={commonStyles.thickPad}>
        <SolidButton label={'SUBMIT'} onPress={handleOnSubmit} />
        <WhitespaceButton label={'SKIP'} onPress={handleOnSkip} />
      </View>
    </ContentFrame>
  ) : (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>We noticed that you&apos;re new here!</Text>
        <Text style={commonStyles.actionText}>Enter your name and contact details</Text>
      </View>
      <ContactDetailsInput/>
      <View style={commonStyles.thickPad}>
      <SolidButton label={'SUBMIT'} onPress={handleOnSubmit} />
      </View>
    </ContentFrame>
  );
}

