import React, {useCallback, useContext } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import moment from 'moment-timezone';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';

type Props = StackScreenProps<RootStackParamList, 'ProgramSelect'>;

export default function ProgramSelect({ navigation }: Props) {
  const { setEvent } = useContext(EventContext);

  function formatProgram(label: string) {
    return {label, value: `${label} ${moment().format('YYYY-MM-DD')}`};
  }
  const PROGRAMS = ['FUNctional Fitness', 'Esports', 'Football', 'Art', 'MMA', 'Music', 'Baking'];

  const handleSetProgram = useCallback(async (program: any) => {
    console.log('bob');
    setEvent(formatProgram(program as string).value);
    navigation.navigate('CheckinTabs');
  }, []);

  return (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <View style={commonStyles.thickPad}>
        <FlatList
          contentContainerStyle={{alignItems: 'center'}}
          data={PROGRAMS.map(program => {return {key: program};})}
          renderItem={({item}) => 
            <Button 
              title={item.key}
              onPress={() => handleSetProgram(item.key)}
            />
          }
        />
      </View>
      <Text onPress={() => navigation.navigate('History')} style={{position: 'absolute', bottom: 0, right: 0}}>See History</Text>
    </ContentFrame>
  );
}
