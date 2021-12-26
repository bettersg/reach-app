import * as React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';

type Props = {
  title: string;
  totalScanned: number;
  onPress?: (eventId: string) => void;
};

const EventDetailRow = ({ title, totalScanned, onPress }: Props) => {
  const handleOnPress = () => {
    onPress && onPress(title);
  };
  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <View style={styles.root}>
        <View style={styles.leftContent}>
          <Text>{title}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.totalScannedText}>{totalScanned}</Text>
          <Text>scanned</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftContent: {
    alignItems: 'flex-start',
    flex: 9,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',

    flex: 2,
  },
  totalScannedText: {
    fontWeight: 'bold',
  },
});

export default EventDetailRow;
