import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  height?: number;
};

const Spacer = ({ height = 20 }: Props) => {
  return <View style={[styles.root, { height }]} />;
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
});

export default Spacer;
