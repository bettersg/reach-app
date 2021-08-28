import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { RootStackParamList } from '@types';
import { StackScreenProps } from '@react-navigation/stack';
import { IdScanner } from '@components';
import { BarCodeScannedCallback } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import validateNric from '@utils/validateNric';

type Props = StackScreenProps<RootStackParamList, 'Scanner'>;

export default function Scanner({ navigation, route }: Props) {
  const { eventId } = route.params;
  const [enableScanning, setEnableScanning] = useState(true);
  const isFocused = useIsFocused();

  const onBarCodeScanned: BarCodeScannedCallback = (event) => {
    if (event.data && isFocused && enableScanning) {
      setEnableScanning(false);
      const nric = event.data;
      const isNricValid = validateNric(nric);
      if (!isNricValid) {
        return;
      }

      Alert.alert('NRIC Scanned', `${event.data} has been scanned`, [
        {
          text: 'OK',
          onPress: () => {
            if (isNricValid) {
              // TODO: store to db.
            }
            setEnableScanning(true);
          },
        },
      ]);
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <IdScanner onBarCodeScanned={onBarCodeScanned} onCancel={onCancel} />
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
