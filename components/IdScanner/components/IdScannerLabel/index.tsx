import React, { FunctionComponent, ReactElement } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
  },
});

const getBarCodeTypeLabel = (barCodeType: string): string => {
  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      return 'scan QR Code';
    case BarCodeScanner.Constants.BarCodeType.code39:
    case BarCodeScanner.Constants.BarCodeType.code128:
    default:
      return 'scan Barcode';
  }
};

const getBarCodeTypeIcon = (barCodeType: string): ReactElement => {
  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      return <AntDesign name="qrcode" size={24} color={'#FFFFFF'} style={{ marginRight: 8 }} />;
    case BarCodeScanner.Constants.BarCodeType.code39:
    case BarCodeScanner.Constants.BarCodeType.code128:
    default:
      return <Ionicons name="md-barcode" size={24} color={'#FFFFFF'} style={{ marginRight: 8 }} />;
  }
};

type IdScannerLabel = {
  barCodeType: string;
};

const IdScannerLabel: FunctionComponent<IdScannerLabel> = ({ barCodeType }) => {
  return (
    <View style={styles.labelWrapper}>
      {getBarCodeTypeIcon(barCodeType)}
      <Text style={styles.labelText}>{getBarCodeTypeLabel(barCodeType)}</Text>
    </View>
  );
};

export default IdScannerLabel;
