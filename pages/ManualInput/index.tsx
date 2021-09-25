import React, {useState, useContext, useCallback} from 'react';
import { Image, Text, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { SolidButton, Spacer } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { registerCheckin } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/EventProvider';
import { TextInput } from 'react-native-paper';
import ContentFrame from '@root/components/ContentFrame';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { isValidNric } from '@root/utils/validateNric';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function ManualInput({ navigation }: Props) {
  const { event } = useContext(EventContext);
  const [nric, setNric] = useState('');
  const [showNricHint, setShowNricHint] = useState(false);

  const handleOnCheckIn = useCallback(async () => {
    const nricWrong = !isValidNric(nric);
    setShowNricHint(nricWrong);
    if (!nricWrong) {
      await registerCheckin(nric, event!);
      navigation.navigate('SuccessfulCheckin');
    }
  }, [nric]);


  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={styles.topContainer}>
          <Text style={{fontSize: 36, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Enter your NRIC</Text>
      </View>
      <View style={styles.topContainer}>
        <TextInput label={'NRIC'} onChangeText={setNric}/>
        <OptionalVisibility isVisible={showNricHint}><Text style={styles.hintText}>Enter a valid NRIC</Text></OptionalVisibility>
        <Spacer/>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
    </ContentFrame>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 250,
    paddingVertical: 20,
  },
  hintText: {
    padding: 10,
    color: 'red'
  }
});
