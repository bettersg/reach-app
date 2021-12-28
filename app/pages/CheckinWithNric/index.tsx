import React, {useContext, useCallback } from 'react';
import { Text, View } from 'react-native';
import { SolidButton } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';
import NricInput from '@root/components/NricInput';
import { getExistingNricProfile } from '@root/utils/profiles.datastore';
import { registerCheckin } from '@root/utils/events.datastore';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function CheckinWithNric({ navigation }: Props) {
  const { idHash, setFirstName, event } = useContext(EventContext);

  const handleOnCheckIn = useCallback(() => {
    (async () => {
      if (idHash) {
        const existingProfile = idHash ? await getExistingNricProfile(idHash) : undefined;
        if (existingProfile !== undefined) {
          await registerCheckin(idHash!, event!);
          setFirstName!(existingProfile.firstName); // For happy face display of name
          navigation.navigate('SuccessfulCheckin');
        } else {
          navigation.navigate('ProfileRegistration', { needsNric: false });
        }
      }
    })();
  }, [idHash]);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Enter your NRIC</Text>
      </View>
      <NricInput onScan={() => navigation.navigate('ScannerFromCheckin')}/>
      <View style={commonStyles.thickPad}>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
    </ContentFrame>
  );
}
