import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '@root/types';
import {Checkin, getEventCheckins} from '@root/utils/events.datastore';
import CheckinRow from '@root/pages/EventDetails/components/CheckinRow';
import {EventContext} from '@root/navigation/providers/EventProvider';

type Props = StackScreenProps<RootStackParamList, 'EventDetails'>;

export default function EventDetails({navigation}: Props) {
    const { event } = useContext(EventContext);
    const [checkins, setCheckins] = useState<Checkin[] | null>(null);

    useEffect(() => {
        (async () => {
            const bb = await getEventCheckins(event?? '');
            console.log(bb);
            setCheckins(bb);
        })();
    }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Details: {event}</Text>
      <View style={styles.separator} />
      <FlatList
          data={checkins}
          renderItem={(checkin) => <CheckinRow checkin={checkin.item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
      paddingLeft: 5,
      paddingRight: 5,
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
});
