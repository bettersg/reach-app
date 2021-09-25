import React, { useEffect } from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';
import { Divider} from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import ContentFrame from '@root/components/ContentFrame';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function SuccessfulCheckin({ navigation }: Props) {
  useEffect(() => {
      setTimeout(function(){
        navigation.navigate('Home');
      }, 3000);
  }, []);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }} >
        <Image source={require('@root/assets/images/sentiment-very-satisfied.png')} style={{flex: 1, resizeMode: 'contain'}} />
      </View>
      <View style={styles.topContainer}>
        <Text style={{fontSize: 36, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Thanks for checking in!</Text>
        <Text style={{fontSize: 36, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Enjoy your visit!</Text>
      </View>
    </ContentFrame>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 250,
    paddingVertical: 20,
  },
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});
