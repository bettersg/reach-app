import * as React from 'react';
import { Text, Image, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssets } from 'expo-asset';

interface ContentFrame {
    onBack?: () => void;
    backButtonText?: string;
  }

const ContentFrame: React.FC<ContentFrame> = ({
    onBack,
    backButtonText = 'BACK TO CHECK IN',
    children
}) => {
  const [assets] = useAssets([
    require('@root/assets/images/reach-icon.png'),
    require('@root/assets/images/keyboard.png'),
    require('@root/assets/images/sentiment-very-satisfied.png'),
    require('@root/assets/images/lines-blue.png'),
    require('@root/assets/images/lines-grey.png'),
    require('@root/assets/images/contact-phone-blue.png'),
    require('@root/assets/images/contact-phone-grey.png'),
  ]);

  if (!assets) {
    return <Text>Oops</Text>;
  }

    return (
    <View style={styles.root}>
        <View style={{flex: 1}}>
            <View style={{alignItems: 'center', justifyContent: 'center' }} >
                <Image source={require('@root/assets/images/reach-icon.png')} style={{width: 120,height:40,}} />
            </View> 
            {onBack && (
            <View style={styles.backButtonWrapper}>
                <TouchableWithoutFeedback onPress={onBack}>
                <View style={styles.backButton}>
                    <Ionicons name="ios-arrow-back" size={20} color={'black'} />
                    <Text style={styles.backButtonText}>{backButtonText}</Text>
                </View>
                </TouchableWithoutFeedback>
            </View>)}
        </View>
        <View style={{flex: 5}}>
            {children}
        </View>
    </View>
    );
};


const styles = StyleSheet.create({
    reachIcon: {
      alignItems:'center',
      justifyContent: 'center'
    },
    root: {
      paddingTop: 60,
      padding: 30,
      flex: 1,
      backgroundColor: 'white',
    },
    backButtonWrapper: {
      flex: 1,
      zIndex: Number.MAX_SAFE_INTEGER,
    },
    backButton: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    backButtonText: {
      paddingLeft: 10,
      color: 'black',
      fontSize: 12,
    },
  });

export default ContentFrame;