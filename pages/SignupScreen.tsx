import {initFirebase} from '@root/utils/initFirebaseApp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { RootStackParamList, Event } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { SolidButton } from '../components';
import { TextInput } from 'react-native-paper';
type Props = StackScreenProps<RootStackParamList, 'Home'>;
const {auth} = initFirebase();

export default function SignupScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onHandleSignup = async () => {
    if (email !== '' && password !== '') {
      await auth.createUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <Text style={styles.title}>Create new account. Temporary step for Firebase backend.</Text>
      <TextInput
        label={'Enter email'}
        onChangeText={setEmail}
      />
      <TextInput
        label={'Enter password'}
        onChangeText={setPassword}
      />
      <SolidButton
        onPress={onHandleSignup}
        label='Signup'
      />
      <RNButton
        onPress={() => navigation.navigate('Login')}
        title='Go to Login'
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
