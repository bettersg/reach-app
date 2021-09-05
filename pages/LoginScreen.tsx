import { initFirebase } from '@utils/initFirebaseApp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { RootStackParamList, Event } from '@types';
import { StackScreenProps } from '@react-navigation/stack';

import { SolidButton, InputField, ErrorMessage } from '../components';
import { Pages } from '@constants';
type Props = StackScreenProps<RootStackParamList, 'Home'>;
const {auth} = initFirebase();

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onLogin() {
    if (email !== '' && password !== '') {
      await auth.signInWithEmailAndPassword(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar/>
      <Text style={styles.title}>Login</Text>
      <InputField
        placeholder={
          'Enter email'
        }
        placeholderTextColor={'#E0E0E0'}
        onChangeText={setEmail}
      />
      <InputField
        placeholder={'Enter password'}
        placeholderTextColor={'#E0E0E0'}
        onChangeText={setPassword}
      />
      <SolidButton
        onPress={onLogin}
        label='Login'
      />
      <RNButton
        onPress={() => navigation.navigate(Pages.SIGNUP)}
        title='Go to Signup'
        color='#fff'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e93b81',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: 24
  }
});
