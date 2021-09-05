import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventTextInput from './components/EventTextInput';
import { SolidButton, Spacer, Divider } from '@components';
import { Pages } from '@constants';
import { RootStackParamList } from '@types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from './components/EventDetailRow';
import { useFocusEffect } from '@react-navigation/native';
import { createOrGetEvent, EventSummary, getActiveEvents, getEventSummary } from '@utils/events.datastore';
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const [event, setEvent] = useState('');
  const [events, setEvents] = useState<EventSummary[]>([]);

  const handleOnStartSession = useCallback(() => {
    if (!event) {
      return;
    }
    (async () => {createOrGetEvent(event);})();

    navigation.navigate(Pages.SCANNER, {
      eventId: event,
    });
  }, [event]);

  /**
   * Fetch the event details list.
   */
  useEffect(() => {
    (async () => {
      const activeEvents = await getActiveEvents();
      const eventSummaries = await Promise.all(activeEvents.map(event => getEventSummary(event)));
      setEvents(eventSummaries);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const activeEvents = await getActiveEvents();
        const eventSummaries = await Promise.all(activeEvents.map(event => getEventSummary(event)));
        setEvents(eventSummaries);
      })();
    }, [])
  );

  const renderItem = ({ item }: { item: EventSummary }) => (
    <EventDetailRow
      title={item.eventId}
      totalScanned={item.numCheckins}
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
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.eventId}
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
