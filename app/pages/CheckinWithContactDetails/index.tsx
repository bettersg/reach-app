import React, {useState, useContext, useCallback} from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SolidButton, Spacer } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { registerNameCheckin } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { TextInput } from 'react-native-paper';
import {commonStyles} from '@root/commonStyles';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function CheckinWithContactDetails({ navigation }: Props) {
  const { event, setName } = useContext(EventContext);
  const [firstName, setFirstName] = useState('');
  const [showFirstNameHint, setShowFirstNameHint] = useState(false);
  const [lastName, setLastName] = useState('');
  const [showLastNameHint, setShowLastNameHint] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPhoneHint, setShowPhoneHint] = useState(false);

  const handleOnCheckIn = useCallback(async () => {
    const firstNameWrong = firstName.length == 0;
    const lastNameWrong = lastName.length == 0;
    const phoneWrong = isNaN(Number(phone)) || phone.length !== 8 || !['6', '8', '9'].includes(phone.slice(0, 1));
    setShowFirstNameHint(firstNameWrong);
    setShowLastNameHint(lastNameWrong);
    setShowPhoneHint(phoneWrong);
    if (!(firstNameWrong || lastNameWrong || phoneWrong)) {
      await registerNameCheckin(`${firstName} ${lastName}`, phone, event!);
      if (setName) setName(firstName);
      navigation.navigate('SuccessfulCheckin');
    }
    
  }, [firstName, lastName, event, phone]);


  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Enter your name and contact details</Text>
      </View>
      <View style={commonStyles.thickPad}>
        <View style={styles.nameInputContainer}>
          <View style={{flex: 3, paddingRight: 5}}>
            <TextInput
              label={'First name'}
              onChangeText={setFirstName}
            />
            <OptionalVisibility isVisible={showFirstNameHint}><Text style={commonStyles.hintText}>Enter your first name</Text></OptionalVisibility>
          </View>
          <View style={{flex: 2, paddingLeft: 5}}>
            <TextInput
              label={'Last name'}
              onChangeText={setLastName}
            />
            <OptionalVisibility isVisible={showLastNameHint}><Text style={commonStyles.hintText}>Enter your last name</Text></OptionalVisibility>
          </View>
        </View>
        <Spacer/>
        <TextInput style={{width: '100%'}}
          label={'Phone number'}
          onChangeText={setPhone}
        />
        <OptionalVisibility isVisible={showPhoneHint}><Text style={commonStyles.hintText}>Enter a valid phone number</Text></OptionalVisibility>
        <Spacer/>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
      <View style={{flex: 3}}/>
    </ContentFrame>
  );
}

const styles = StyleSheet.create({
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  }
});
