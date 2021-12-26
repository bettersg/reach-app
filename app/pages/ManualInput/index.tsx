import React, {useState, useContext, useCallback} from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SolidButton, Spacer } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { registerCheckin } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import { TextInput } from 'react-native-paper';
import ContentFrame from '@root/components/ContentFrame';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { isValidNric } from '@root/utils/validateNric';
import { commonStyles } from '@root/commonStyles';
import { getExistingNricProfile } from '@root/utils/profiles.datastore';
import { hash } from '@root/utils/cryptography';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function ManualInput({ navigation }: Props) {
  const { event, setIdHash, setName } = useContext(EventContext);
  const [nric, setNric] = useState('');
  const [showNricHint, setShowNricHint] = useState(false);

  const handleOnCheckIn = useCallback(async () => {
    const nricWrong = !isValidNric(nric);
    setShowNricHint(nricWrong);
    if (!nricWrong) {
      if (setIdHash) setIdHash(await hash(nric));
      await registerCheckin(await hash(nric), event!);
      const existingProfile = await getExistingNricProfile(await hash(nric));
      if (existingProfile === undefined) {
        navigation.navigate('ProfileRegistration');
      } else {
        if (setName) setName(existingProfile.firstName);
        navigation.navigate('SuccessfulCheckin');
      }
    }
  }, [nric]);


  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Enter your NRIC</Text>
      </View>
      <View style={commonStyles.thickPad}>
        <TextInput label={'NRIC'} onChangeText={setNric} style={{width: '100%'}}/>
        <OptionalVisibility isVisible={showNricHint}><Text style={commonStyles.hintText}>Enter a valid NRIC</Text></OptionalVisibility>
        <Spacer/>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
    </ContentFrame>
  );
}
