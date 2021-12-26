import React, {useContext, useCallback} from 'react';
import { Text, View } from 'react-native';
import { SolidButton } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';
import NricInput from '@root/components/NricInput';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function ManualInput({ navigation }: Props) {
  const { idHash } = useContext(EventContext);

  const handleOnCheckIn = useCallback(async () => {
    if (idHash) navigation.navigate('ProfileRegistration', { needsNric: false });
  }, [idHash]);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Enter your NRIC</Text>
      </View>
      <NricInput/>
      <View style={commonStyles.thickPad}>
        <SolidButton label={'CHECK IN'} onPress={handleOnCheckIn} />
      </View>
      
    </ContentFrame>
  );
}
