import React, {useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Checkin, NameCheckin, ProfileCheckin} from '@root/utils/events.datastore';
import moment from 'moment-timezone';
import { getExistingNricProfile } from '@root/utils/profiles.datastore';

type Props = {
    checkin: Checkin;
};

const CheckinRow = ({ checkin }: Props) => {
    const [fullName, setFullName] = React.useState<string | undefined>('Loading...');
    useEffect(() => {
        (async () => {
            if (checkin.identity === 'NAME') {
                setFullName((checkin as NameCheckin).fullName);
            } else {
                const profile = await getExistingNricProfile((checkin as ProfileCheckin).idHash);
                if (profile !== undefined) {
                    setFullName(`${profile.firstName} ${profile!.lastName}`);
                } else {
                    setFullName('Guest');
                }
            }
        })();
    }, [checkin]);

    return (fullName == undefined) ? null : (
        <View style={styles.root}>
            <View style={styles.leftContent}>
                <Text>{fullName}</Text>
            </View>
            <View style={styles.rightContent}>
                <Text>Scanned at</Text>
                <Text style={styles.totalScannedText}>{moment.unix(checkin.checkinTimestamp).format('hh:mm A')}</Text>
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
