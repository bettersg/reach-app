import React, { useContext, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { Spacer} from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';
import { EventContext } from '@root/navigation/providers/CheckinProvider';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function SuccessfulCheckin({ navigation }: Props) {
  const { firstName } = useContext(EventContext);
  useEffect(() => {
        setTimeout(function(){
            if (navigation.getState().routes.slice(-1)[0].name === 'SuccessfulCheckin') navigation.navigate('Home');
        }, 3000);
  }, []);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Image source={require('@root/assets/images/sentiment-very-satisfied.png')} style={{resizeMode: 'contain'}} />
        <Spacer height={50}/>
        <Text style={commonStyles.actionText}>{`Thanks for checking in, ${firstName}!`}</Text>
        <Text style={commonStyles.actionText}>Enjoy your visit!</Text>
      </View>
    </ContentFrame>
  );
}
