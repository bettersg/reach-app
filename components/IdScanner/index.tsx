import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  LayoutRectangle,
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import LoadingView from '../LoadingView';
import { Ionicons } from '@expo/vector-icons';
import IdScannerCamera, {
  IdScannerCameraProp,
} from './components/IdScannerCamera';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

interface IdScanner extends IdScannerCameraProp {
  onCancel: () => void;
  cancelButtonText?: string;
  isScanningEnabled?: boolean;
  hasLimitedInterestArea?: boolean;
}

/**
 * A fullscreen scanner with a back button on the top left.
 * If you want a scanner that is not fullscreen, use `CustomCamera`.
 *
 * The following components are shown when `hasLimitedInterestArea` is true:
 * - Lightbox in the middle of the screen.
 * - Label on top of the lightbox with an icon and label indicating
 *    what `barCodeType` to scan.
 *
 * Scanning also only occurs within the bounds of the lightbox for Android.
 */
const IdScanner: React.FC<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39],
  onCancel,
  isScanningEnabled = true,
  hasLimitedInterestArea = true,
}) => {
  const [platform] = useState<string>(Platform.OS);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [interestArea] = useState<LayoutRectangle | undefined>(
    hasLimitedInterestArea ? getInterestAreaDimensions(barCodeTypes) : undefined
  );

  useEffect(() => {
    const askForCameraPermission = async (): Promise<void> => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === 'granted') {
        setHasCameraPermission(true);
      } else {
        onCancel();
      }
    };

    askForCameraPermission();
  }, [onCancel]);

  const checkIfInInterestArea: BarCodeScannedCallback = (event) => {
    const { bounds } = event;
    if (bounds && interestArea) {
      const { origin, size: boundsSize } = bounds;
      const { x: interestAreaX, y: interestAreaY } = interestArea;
      if (origin && boundsSize && interestAreaX && interestAreaY) {
        const { x: boundsX, y: boundsY } = origin;
        const { width: boundsWidth, height: boundsHeight } = boundsSize;
        const { width: interestAreaWidth, height: interestAreaHeight } =
          interestArea;
        if (
          boundsX >= interestAreaX &&
          boundsY >= interestAreaY &&
          boundsX + boundsWidth <= interestAreaX + interestAreaWidth &&
          boundsY + boundsHeight <= interestAreaY + interestAreaHeight
        ) {
          if (onBarCodeScanned) {
            onBarCodeScanned(event);
          }
        }
      }
    }
  };

  /**
   * We only scan codes within the lightbox if the user is using Android.
   */
  return (
    <View style={styles.cameraWrapper}>
      {hasCameraPermission && isScanningEnabled ? (
        <IdScannerCamera
          onBarCodeScanned={
            hasLimitedInterestArea &&
            platform === 'android' &&
            Constants.isDevice
              ? checkIfInInterestArea
              : onBarCodeScanned
          }
          cancelButtonText={'Cancel'}
          onCancel={onCancel}
          barCodeTypes={barCodeTypes}
          interestArea={interestArea}
        >
          <View style={styles.backButtonWrapper}>
            <TouchableWithoutFeedback onPress={onCancel}>
              <View style={styles.backButton}>
                <Ionicons name="ios-arrow-back" size={16} color={'white'} />
                <Text style={styles.backButtonText}>Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </IdScannerCamera>
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  backButtonWrapper: {
    position: 'absolute',
    marginTop: 48,
    zIndex: Number.MAX_SAFE_INTEGER,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  interestArea: {
    position: 'absolute',
  },
  backButton: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    paddingLeft: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default IdScanner;
