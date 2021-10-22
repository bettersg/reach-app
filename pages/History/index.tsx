import React, { useEffect, useContext, useState} from 'react';
import { TouchableOpacity, Text, FlatList } from 'react-native';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from '@root/pages/History/components/EventDetailRow';
import { Checkin, EventSummary, getActiveEvents, getEventCheckins, getEventSummary } from '@root/utils/events.datastore';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import ContentFrame from '@root/components/ContentFrame';
import CheckinRow from './components/CheckinRow';
import { commonStyles } from '@root/commonStyles';
import { Spacer } from '@root/components';
type Props = StackScreenProps<RootStackParamList, 'History'>;

export default function History({ navigation }: Props) {
  const { events, setEvents, event, setEvent } = useContext(EventContext);
  const [checkins, setCheckins] = useState<Checkin[] | null>(null);


  useEffect(() => {
    if (setEvent) setEvent(undefined);
  }, []);

  /**
   * Fetch the event details list.
   */
  useEffect(() => {
    (async () => {
      if (event === undefined) { // General overview
        const activeEvents = await getActiveEvents();
        const eventSummaries = await Promise.all(activeEvents.map(event => getEventSummary(event)));
        if (setEvents) setEvents(eventSummaries);
      } else { // Zoom in on one event
        setCheckins(await getEventCheckins(event));
      }
    })();
  }, [event]);

  const renderEventRow = ({ item }: { item: EventSummary }) => (
    <EventDetailRow
      title={item.eventId}
      totalScanned={item.numCheckins}
      onPress={() => {
        if (setEvent) setEvent(item.eventId);
      }}
    />
  );

  return !!event ? (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <TouchableOpacity onPress={() => setEvent!(undefined)}>
        <Text style={commonStyles.actionText}>{event}</Text>
      </TouchableOpacity>
      <Spacer/>
      <FlatList
          data={checkins}
          renderItem={(checkin) => <CheckinRow checkin={checkin.item} />}
          keyExtractor={(item) => `${item.checkinTimestamp}`}
      />
    </ContentFrame>
  ): (
    <ContentFrame onBack={() => navigation.navigate('Home')}>
      <Text style={commonStyles.actionText}>Recent events</Text>
      <Spacer/>
      <FlatList
        data={events}
        renderItem={renderEventRow}
        keyExtractor={(item) => item.eventId}
      />
    </ContentFrame>
  ); 
}
