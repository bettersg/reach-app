import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventTextInput from './components/EventTextInput';
import { SolidButton, Spacer, Divider } from '@components';
import { Pages } from '@constants';
import { RootStackParamList, Event } from '@types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from './components/EventDetailRow';
import { useFocusEffect } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

// TODO: Mock data. waiting for utilities
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    totalScanned: 100,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    totalScanned: 10,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    totalScanned: 5000,
  },
];

export default function Home({ navigation }: Props) {
  const [event, setEvent] = useState('');
  const [events, setEvents] = useState([]);

  const handleOnStartSession = useCallback(() => {
    if (!event) {
      return;
    }

    navigation.navigate(Pages.SCANNER, {
      eventId: event,
    });
  }, [event]);

  // TODO: waiitng for utilities
  /**
   * Fetch the event details list.
   */
  //useEffect(() => {}, []);

  // TODO: should re-fetch the list
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const renderItem = ({ item }: { item: Event }) => (
    <EventDetailRow
      title={item.title}
      totalScanned={item.totalScanned}
      onPress={() => {
        navigation.navigate(Pages.EVENT_DETAILS);
      }}
    />
  );

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <EventTextInput
          placeholder={
            'Please type in the event name to start taking attendance'
          }
          placeholderTextColor={'#E0E0E0'}
          onChangeText={setEvent}
        />
        <Spacer />
        <SolidButton label={'Start Session'} onPress={handleOnStartSession} />
      </View>
      <Divider />

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
