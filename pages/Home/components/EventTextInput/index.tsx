import * as React from 'react';
import { StyleSheet, View, TextInputProps, TextInput } from 'react-native';
import { Colors } from '@constants';

const EventTextInput = (props: TextInputProps) => {
  return (
    <View style={styles.root}>
      <TextInput {...props} style={styles.textInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    minHeight: 48,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textInput: {
    backgroundColor: 'white',
    flex: 1,
  },
});

export default EventTextInput;
