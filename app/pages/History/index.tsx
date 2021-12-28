import ContentFrame from '@root/components/ContentFrame';
import { RootStackParamList } from '@root/types';
import { StackScreenProps } from '@react-navigation/stack';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import React, { useState, useContext } from 'react';
import {Calendar} from 'react-native-calendars';
import moment from 'moment-timezone';
import { EventSummary, getEventsOnDate, getEventSummary } from '@root/utils/events.datastore';
import { Spacer } from '@root/components';
import { FlatList } from 'react-native';
import EventDetailRow from './components/EventDetailRow';
import { Colors } from '@root/constants';

type Props = StackScreenProps<RootStackParamList, 'History'>;

export default function MyCalendar({ navigation }: Props) {
  const { events, setEvents } = useContext(EventContext);
  const [selectedDate, setSelectedDate] = useState(moment());

  const renderEventRow = ({ item }: { item: EventSummary }) => (
    <EventDetailRow
      title={item.eventId}
      totalScanned={item.numCheckins}
    />
  );

  async function renderEventsOnDate(selectedMoment: moment.Moment) {
    const events = await getEventsOnDate(selectedMoment);
    const eventSummaries = await Promise.all(events.map(event => getEventSummary(event)));
    if (setEvents) setEvents(eventSummaries.filter(eventSummary => eventSummary.numCheckins > 0));
  }

  return <ContentFrame onBack={() => navigation.navigate('Home')}>
    <Calendar
      onDayPress={async (day) => {
        const selectedMoment = moment.tz(day.dateString, 'Asia/Singapore');
        setSelectedDate(selectedMoment);
        await renderEventsOnDate(selectedMoment);
      }}
      markedDates={{
        [selectedDate.format('YYYY-MM-DD')]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: Colors.primary,
          selectedTextColor: '#FFFFFF',
        },
      }}
      monthFormat={'yyyy MMM'}
    />
    <Spacer/>
      <FlatList
        data={events}
        renderItem={renderEventRow}
        keyExtractor={(item) => item.eventId}
      />
  </ContentFrame>;
}
