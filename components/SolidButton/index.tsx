import * as React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Colors } from '@root/constants';

type Props = {
  label: string;
  onPress: () => void;
};

const SolidButton = ({ label, onPress }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.root}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.primary,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default SolidButton;
