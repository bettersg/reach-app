import React, { useContext, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { IdScanner } from '@root/components';
import { BarCodeScannedCallback } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import validateNric from '@root/utils/validateNric';
import { registerCheckin } from '@root/utils/events.datastore';
import { EventContext } from '@root/navigation/providers/EventProvider';

type Props = StackScreenProps<RootStackParamList, 'Scanner'>;

export default function Scanner({ navigation, route }: Props) {
  const { event } = useContext(EventContext);
  const [enableScanning, setEnableScanning] = useState(true);
  const isFocused = useIsFocused();

  const onBarCodeScanned: BarCodeScannedCallback = (barCodeEvent) => {
    if (barCodeEvent.data && isFocused && enableScanning) {
      setEnableScanning(false);
      const nric = barCodeEvent.data;
      const isNricValid = validateNric(nric);
      if (isNricValid) {
        Alert.alert('NRIC Scanned', `${barCodeEvent.data} has been scanned`, [
          {
            text: 'OK',
            onPress: async () => {
              registerCheckin(nric, event!);
              setEnableScanning(true);
            },
          },
        ]);
      }
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
