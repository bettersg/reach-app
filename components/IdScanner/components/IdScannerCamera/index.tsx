import React from 'react';
import { LayoutRectangle, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { BarCodeScanner, BarCodeScannerProps } from 'expo-barcode-scanner';
import LightBox from '../LightBox';
import IdScannerLabel from '../IdScannerLabel';

export type IdScannerCameraProp = Pick<BarCodeScannerProps, 'onBarCodeScanned' | 'barCodeTypes'> & {
  cancelButtonText?: string;
  onCancel?: () => void;
  interestArea?: LayoutRectangle;
  style?: StyleProp<ViewStyle>;
};

const IdScannerCamera: React.FC<IdScannerCameraProp> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39],
  interestArea,
  style,
  children,
}) => {
  return (
    <>
      {children}
      <BarCodeScanner barCodeTypes={barCodeTypes} onBarCodeScanned={onBarCodeScanned} style={style ?? styles.scanner} />
      {interestArea && (
        <LightBox
          width={interestArea.width}
          height={interestArea.height}
          label={<IdScannerLabel barCodeType={barCodeTypes[0]} />}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default IdScannerCamera;
