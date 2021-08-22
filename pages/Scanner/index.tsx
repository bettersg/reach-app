import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from '@types';

export default function Scanner({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner</Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
