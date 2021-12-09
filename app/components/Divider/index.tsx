import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const Divider = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#E0E0E0',
    height: 0.5,
  },
});

export default Divider;
