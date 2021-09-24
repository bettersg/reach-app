import React, { useEffect, useContext} from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { Divider } from '@root/components';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from '@root/pages/History/components/EventDetailRow';
import { useFocusEffect } from '@react-navigation/native';
import { EventSummary, getActiveEvents, getEventSummary } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/EventProvider';
type Props = StackScreenProps<RootStackParamList, 'History'>;

export default function History({ navigation }: Props) {
  const { events, setEvents } = useContext(EventContext);

  /**
   * Fetch the event details list.
   */
  useEffect(() => {
    (async () => {
      const activeEvents = await getActiveEvents();
      const eventSummaries = await Promise.all(activeEvents.map(event => getEventSummary(event)));
      if (setEvents) setEvents(eventSummaries);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const activeEvents = await getActiveEvents();
        const eventSummaries = await Promise.all(activeEvents.map(event => getEventSummary(event)));
        if (setEvents) setEvents(eventSummaries);
      })();
    }, [])
  );

  const renderItem = ({ item }: { item: EventSummary }) => (
    <EventDetailRow
      title={item.eventId}
      totalScanned={item.numCheckins}
      onPress={() => {
        navigation.navigate('EventDetails');
      }}
    />
  );

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>Past Attendance</Text>
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
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
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
