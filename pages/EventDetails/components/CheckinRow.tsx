import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Checkin} from '@utils/events.datastore';
import moment from 'moment';

type Props = {
    checkin: Checkin;
};

const CheckinRow = ({ checkin }: Props) => {
    return (
        <View style={styles.root}>
            <View style={styles.leftContent}>
                <Text>{checkin.idHash}</Text>
            </View>
            <View style={styles.rightContent}>
                <Text>Scanned at</Text>
                <Text style={styles.totalScannedText}>{moment.unix(checkin.checkinTimestamp).format('hh:mm:ss')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 16,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    leftContent: {
        alignItems: 'flex-start',
        flex: 9,
    },
    rightContent: {
        justifyContent: 'center',
        alignItems: 'center',

        flex: 2,
    },
    totalScannedText: {
        fontWeight: 'bold',
    },
});

export default CheckinRow;
