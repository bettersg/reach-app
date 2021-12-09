import React, {useCallback, useContext} from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { createOrGetEvent } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import moment from 'moment';
import ContentFrame from '@root/components/ContentFrame';
import { commonStyles } from '@root/commonStyles';
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { event, setEvent } = useContext(EventContext);

  async function handleDropIn() {
    if (!setEvent) return;
    const programName = `Drop In ${moment().format('YYYY-MM-DD')}`;
    setEvent(programName);
    await createOrGetEvent(programName);
    navigation.navigate('CheckinTabs');
  }

  async function handleAttendProgram() {
    if (!setEvent) return;
    const programName = `Other Program ${moment().format('YYYY-MM-DD')}`;
    setEvent(programName);
    createOrGetEvent(programName);
    navigation.navigate('CheckinTabs');
  }

  const handleOnHistory = useCallback(() => {
    navigation.navigate('History');
  }, []);

  return (
    <ContentFrame>
      <View style={commonStyles.thickPad}>
        <Text style={commonStyles.actionText}>Hey there! Please check in before entering the centre.</Text>
        <View style={{height: 50}}/>
        <TouchableOpacity onPress={handleDropIn} style={styles.menuButton}>
            <Image source={require('@root/assets/images/person-pin.png')} style={{flex: 1, resizeMode: 'contain'}} />
            <Text style={{fontSize: 18, textAlign: 'left', flex: 2}}>I am dropping in for a visit</Text>
            <View style={{flex: 0.6}} />
        </TouchableOpacity>
        <View style={{height: 50}}/>
        <TouchableOpacity onPress={handleAttendProgram} style={styles.menuButton}>
          <Image source={require('@root/assets/images/flat-icon.png')} style={{flex: 1, resizeMode: 'contain'}} />
          <Text style={{fontSize: 18, textAlign: 'left', flex: 2}}>I am here to attend a program</Text>
          <View style={{flex: 0.6}} />
        </TouchableOpacity>
      </View>
      <Text onPress={handleOnHistory} style={{position: 'absolute', bottom: 0, right: 0}}>See History</Text>
    </ContentFrame>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    borderStyle: 'solid', 
    borderWidth: 2, 
    borderColor: '#DDDDDD', 
    width: 448, 
    height:124, 
    justifyContent: 'center', 
    flexDirection: 'row', 
    alignItems: 'center' 
  }
});
