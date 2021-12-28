import { initFirebase } from '@root/utils/initFirebaseApp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { RootStackParamList, Event } from '@root/types';
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

  const onHandleSignup = async () => {
    if (email !== '' && password !== '') {
      await auth.createUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <View style={{...commonStyles.thickPad, backgroundColor: 'white'}}>
      <Spacer height={50}/>
      <Text style={commonStyles.actionText}>Sign up for a new account</Text>
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
        onPress={onHandleSignup}
        label='SIGN UP'
      />
      <WhitespaceButton
        onPress={() => navigation.navigate('Login')}
        label='GO TO LOGIN'
      />
    </View>
  );
}
