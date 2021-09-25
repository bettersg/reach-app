import React, { useEffect, useContext} from 'react';
import { FlatList } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from '@root/pages/History/components/EventDetailRow';
import { useFocusEffect } from '@react-navigation/native';
import { EventSummary, getActiveEvents, getEventSummary } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/EventProvider';
import ContentFrame from '@root/components/ContentFrame';
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
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.eventId}
      />
    </ContentFrame>
  );
}
