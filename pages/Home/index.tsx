import React, {useCallback, useEffect, useContext} from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Spacer, Divider } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { createOrGetEvent } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/EventProvider';
import moment from 'moment';
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { event, setEvent } = useContext(EventContext);

  async function handleDropIn() {
    if (!setEvent) return;
    const programName = `Drop In ${moment().format('YYYY-MM-DD')}`;
    setEvent(programName);
    await createOrGetEvent(programName);
    navigation.navigate('Scanner', {eventId: programName});
  }

  async function handleAttendProgram() {
    if (!setEvent) return;
    const programName = `Other Program ${moment().format('YYYY-MM-DD')}`;
    setEvent(programName);
    createOrGetEvent(programName);
    navigation.navigate('Scanner', {eventId: programName});
  }

  const handleOnHistory = useCallback(() => {
    navigation.navigate('History');
  }, []);

  return (
    <View style={styles.root}>
      <Text onPress={handleOnHistory} style={{textAlign: 'right', paddingHorizontal: 20, paddingVertical: 20}}>See History</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <Image source={require('@root/assets/images/reach-icon.png')} style={{width: 120,height:40,}} />
      </View> 
      <View style={{paddingHorizontal: 150, paddingVertical: 20, flex: 1}}>
        <Text style={{fontSize: 36, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Hey there! Please check in before entering the centre.</Text>
      </View>
      <View style={{paddingHorizontal: 60, paddingVertical: 20, flex: 1, alignItems: 'center'}}>
        <TouchableOpacity onPress={handleDropIn} style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#DDDDDD', width: 448, height:124, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('@root/assets/images/person-pin.png')} style={{flex: 1, resizeMode: 'contain'}} />
          <Text style={{fontSize: 18, textAlign: 'left', flex: 2}}>I am dropping in for a visit</Text>
          <View style={{flex: 0.6}} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 60, paddingVertical: 20, flex: 1, alignItems: 'center'}}>
        <TouchableOpacity onPress={handleAttendProgram} style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#DDDDDD', width: 448, height:124, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('@root/assets/images/flat-icon.png')} style={{flex: 1, resizeMode: 'contain'}} />
          <Text style={{fontSize: 18, textAlign: 'left', flex: 2}}>I am here to attend a program</Text>
          <View style={{flex: 0.6}} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 20, paddingVertical: 20, flex: 3}}>
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  reachIcon: {
    alignItems:'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  },
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  spacer: {
    height: 10,
  },
});
