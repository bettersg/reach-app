import { initFirebase } from '@root/utils/initFirebaseApp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { RootStackParamList, Event } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper';

import { SolidButton, } from '../components';
import { Colors } from '@root/constants';
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
    <View style={styles.container}>
      <StatusBar/>
      <Text style={styles.title}>Login. Temporary step for Firebase backend.</Text>
      <TextInput
        label={'Enter email'}
        onChangeText={setEmail}
      />
      <TextInput
        label={'Enter password'}
        onChangeText={setPassword}
      />
      <SolidButton
        onPress={onLogin}
        label='Login'
      />
      <RNButton
        onPress={() => navigation.navigate('Signup')}
        title='Go to Signup'
        color='#fff'
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
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: 24
  }
});
