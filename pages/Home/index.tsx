import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventTextInput from './components/EventTextInput';
import { SolidButton, Spacer, Divider } from '@components';
import { Pages } from '@constants';
import { RootStackParamList, Event } from '@types';
import { StackScreenProps } from '@react-navigation/stack';
import EventDetailRow from './components/EventDetailRow';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEvents } from '@utils/api';
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const [event, setEvent] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  const handleOnStartSession = useCallback(() => {
    if (!event) {
      return;
    }

    navigation.navigate(Pages.SCANNER, {
      eventId: event,
    });
  }, [event]);

  /**
   * Fetch the event details list.
   */
  useEffect(() => {
    (async () => {
      const results = await getAllEvents();
      console.log(results);
      const transformedEvents = results.map((event) => {
        return {
          title: event.event_id,
          totalScanned: event.total,
        };
      });

      setEvents(transformedEvents);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      (async () => {
        const results = await getAllEvents();
        console.log(results);
        const transformedEvents = results.map((event) => {
          return {
            title: event.event_id,
            totalScanned: event.total,
          };
        });

        setEvents(transformedEvents);
      })();
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
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
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
