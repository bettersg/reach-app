import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  Image,
  Dimensions,
  LayoutRectangle,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import LoadingView from '@root/components/LoadingView';
import { Ionicons } from '@expo/vector-icons';
import IdScannerCamera from '@root/components/IdScanner/components/IdScannerCamera';

import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import validateNric from '@root/utils/validateNric';
import { EventContext } from '@root/navigation/providers/CheckinProvider';
import { hash } from '@root/utils/cryptography';
import moment from 'moment';
import { createOrGetEvent, registerCheckin } from '@root/utils/events.datastore';
import { registerProfile } from '@root/utils/profiles.datastore';

const interestAreaRatios: Record<string, Record<string, number>> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: { width: 0.7, height: 0.35 },
  [BarCodeScanner.Constants.BarCodeType.code39]: { width: 0.9, height: 0.25 },
  [BarCodeScanner.Constants.BarCodeType.code128]: { width: 0.9, height: 0.25 },
};

const getInterestAreaDimensions = (
  barCodeTypes: string[] | undefined
): LayoutRectangle => {
  const { width, height } = Dimensions.get('window');
  if (!barCodeTypes) {
    return { x: 0, y: 0, width, height };
  }

  const barCodeType = barCodeTypes[0];
  const widthRatio = interestAreaRatios[barCodeType].width;
  const heightRatio = interestAreaRatios[barCodeType].height;
  let areaWidth = width;
  let areaHeight = height;

  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      areaWidth = areaWidth * widthRatio;
      areaHeight = areaWidth;
      break;
    default:
      areaWidth = areaWidth * widthRatio;
      areaHeight = areaHeight * heightRatio;
  }

  return {
    x: (width * (1 - widthRatio)) / 2,
    y: (height * (1 - heightRatio)) / 2,
    width: areaWidth,
    height: areaHeight,
  };
};

type Props = StackScreenProps<RootStackParamList, 'ScannerFromRegistration'>;

export default function Scanner({ navigation }: Props) {
  const { setIdHash, firstName, lastName, phone, idHash, event } = useContext(EventContext);
  const [enableScanning, setEnableScanning] = useState(true);
  const isFocused = useIsFocused();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39];
  const [interestArea] = useState<LayoutRectangle | undefined>(getInterestAreaDimensions(barCodeTypes));

  const onCancel = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const askForCameraPermission = async (): Promise<void> => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === 'granted') {
        setHasCameraPermission(true);
        setEnableScanning(true);
      } else {
        onCancel();
      }
    };
    askForCameraPermission();
  }, [onCancel]);

  const onBarCodeScanned: BarCodeScannedCallback = useCallback(async (barCodeEvent) => {
    if (barCodeEvent.data && isFocused && enableScanning) {
      setEnableScanning(false);
      const nric = barCodeEvent.data;
      const isNricValid = validateNric(nric);
      if (isNricValid) {
        setIdHash!(await hash(nric));
        if (firstName && lastName && phone && event && idHash) {
          await registerProfile({
              idHash,
              firstName,
              lastName,
              phone,
              createdAt: moment().unix(),
          });
          await createOrGetEvent(event!);
          await registerCheckin(idHash, event!);
          navigation.navigate('SuccessfulCheckin');
        }
      }
    }
  }, [firstName, lastName, event, phone, idHash]);

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
      {hasCameraPermission ? (
        <IdScannerCamera
          onBarCodeScanned={onBarCodeScanned}
          cancelButtonText={'Cancel'}
          onCancel={onCancel}
          barCodeTypes={barCodeTypes}
          interestArea={interestArea}
        >
          <View style={styles.backButtonWrapper}>
            <TouchableWithoutFeedback onPress={onCancel}>
              <View style={styles.backButton}>
                <Ionicons name="ios-arrow-back" size={20} color={'white'} />
                <Text style={styles.backButtonText}>BACK TO CHECK IN</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex: 1, borderWidth: 2, borderColor: 'black'}} />
          <View style={styles.keyboardWrapper}> 
            <TouchableWithoutFeedback onPress={() => navigation.navigate('ProfileRegistration', {needsNric: true})}>
              <Image source={require('@root/assets/images/keyboard.png')} style={styles.keyboard} />
            </TouchableWithoutFeedback>
          </View>
          
        </IdScannerCamera>
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  backButtonWrapper: {
    flex: 1,
    zIndex: Number.MAX_SAFE_INTEGER,
  },
  keyboardWrapper: {
    flex: 0.8,
    alignContent: 'center',
    paddingTop: 0,
    zIndex: Number.MAX_SAFE_INTEGER,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  interestArea: {
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    flexDirection: 'row',
    paddingTop: 50,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    paddingLeft: 10,
    color: 'white',
    fontSize: 12,
  },
  keyboard: {
    paddingHorizontal: '50%',
    resizeMode: 'contain'
  },
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