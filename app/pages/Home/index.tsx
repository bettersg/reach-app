import React, {useCallback, useContext, useState} from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import moment from 'moment-timezone';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { setEvent, setFirstName, setLastName, setIdHash, setPhone, event } = useContext(EventContext);
  const [seeDropdown, setSeeDropdown] = useState(false);

  // For Dropdown picker
  const [open, setOpen] = useState(true);

  function formatProgram(label: string) {
    return {label, value: `${label} ${moment().format('YYYY-MM-DD')}`};
  }
  const PROGRAMS = ['FUNctional Fitness', 'Esports', 'Football', 'Art', 'MMA', 'Music', 'Baking']
    .map(formatProgram);

  const handleSetProgram = useCallback(async (program: any) => {
    console.log('bob');
    setEvent(formatProgram(program as string).value);
    navigation.navigate('CheckinTabs');
  }, []);

  // Reset state upon reaching Home
  useFocusEffect(useCallback(() => {
    setFirstName!(undefined);
    setLastName!(undefined);
    setIdHash!(undefined);
    setEvent!(undefined);
    setPhone!(undefined);
    setSeeDropdown(false);
  }, [setEvent, setFirstName, setLastName, setIdHash, setPhone]));

  return (
    <ContentFrame>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Hey there! Please check in before entering the centre.</Text>
        <View style={{height: 50}}/>
        <TouchableOpacity onPress={() => handleSetProgram('Drop In')} style={commonStyles.menuButton}>
          <Image source={require('@root/assets/images/person-pin.png')} style={{flex: 0.8, resizeMode: 'contain'}} />
          <Text style={{...commonStyles.mainButtonText, flex: 2}}>I am dropping in for a visit</Text>
          <View style={{flex: 0.3}} />
        </TouchableOpacity>
        <View style={{height: 30}}/>
          <TouchableOpacity onPress={() => navigation.navigate('ProgramSelect')} style={commonStyles.menuButton}>
            <Image source={require('@root/assets/images/flat-icon.png')} style={{flex: 0.8, resizeMode: 'contain'}} />
            <Text style={{...commonStyles.mainButtonText, flex: 2}}>I am here to attend a program</Text>
            <View style={{flex: 0.3}} />
          </TouchableOpacity>
        </View>
      <Text onPress={() => navigation.navigate('History')} style={{position: 'absolute', bottom: 0, right: 0}}>See History</Text>
    </ContentFrame>
  );
}
