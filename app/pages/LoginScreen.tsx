import { initFirebase } from '@root/utils/initFirebaseApp';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper';

import { SolidButton, Spacer, } from '../components';
import { Colors } from '@root/constants';
import { commonStyles } from '@root/commonStyles';
import { WhitespaceButton } from '@root/components/SolidButton';
type Props = StackScreenProps<RootStackParamList, 'Home'>;
const {auth} = initFirebase();

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onLogin() {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error: unknown) {
      navigation.navigate('Signup');
    }
  };

  return (
    <View style={{...commonStyles.thickPad, backgroundColor: 'white', height: '100%'}}>
      <Spacer height={50}/>
      <Text style={commonStyles.actionText}>Log in to your account</Text>
      <Spacer height={50}/>
      <TextInput
        label={'Enter email'}
        onChangeText={setEmail}
        style={{width:'100%'}}
      />
      <Spacer height={20}/>
      <TextInput
        label={'Enter password'}
        onChangeText={setPassword}
        style={{width:'100%'}}
      />
      <Spacer height={30}/>
      <SolidButton
        onPress={onLogin}
        label='Login'
      />
      <WhitespaceButton
        onPress={() => navigation.navigate('Signup')}
        label='GO TO SIGNUP'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
    paddingBottom: 24
  }
});
