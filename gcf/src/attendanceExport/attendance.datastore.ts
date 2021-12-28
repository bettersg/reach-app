import { initFirebaseAdmin } from '@root/initFirebaseAdmin';
import { cacheWithExpiry } from '@root/utils/cacheWithExpiry';
import moment from 'moment-timezone';

const { fs } = initFirebaseAdmin();
export const REACH_UID = 'futLaGLJNpafA9HgIdBzHjVnCro1'

export type Checkin = ProfileCheckin | NameCheckin;

export interface NameCheckin {
    eventId: string;
    checkinTimestamp: number;
    identity: 'NAME';
    fullName: string;
    phone: string;
}

export interface ProfileCheckin {
    eventId: string;
    checkinTimestamp: number;
    identity: 'PROFILE';
    idHash: string;
}

export interface EventSummary extends Event {
    numCheckins: number;
}

export interface Event {
    eventId: string;
    time: number; // Epoch
}



/** Retrieves the checkins to an event. */
export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
    return fs
        .collection('accounts')
        .doc(REACH_UID)
        .collection('checkins')
        .where('eventId', '==', eventId)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Checkin));
}

export async function getEventsOnDate(date: moment.Moment): Promise<Event[]> {
    return fs
        .collection('accounts')
        .doc(REACH_UID)
        .collection('events')
        .where('time', '>=', date.startOf('day').unix() * 1000)
        .where('time', '<=', date.endOf('day').unix() * 1000)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Event));
}


export interface Profile {
    idHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: number; // moment().unix()
}

async function getExistingNricProfileRemotely(idHash: string): Promise<Profile | undefined> {
    try {
        return fs
            .collection('accounts')
            .doc(REACH_UID)
            .collection('profiles')
            .doc(idHash)
            .get()
            .then((snapshot) => snapshot.data() as Profile);
    } catch (error) {
        return undefined; // Nope, doesn't exist.
    }
}
export const getExistingNricProfile = cacheWithExpiry(getExistingNricProfileRemotely).cachedFunction;

export async function getExistingNameProfile(
    firstName: string,
    lastName: string
): Promise<Profile | undefined> {
    const matches = await fs
        .collection('accounts')
        .doc(REACH_UID)
        .collection('profiles')
        .where('firstName', '==', firstName)
        .where('lastName', '==', lastName)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Profile));

    return matches.length > 0 ? matches[0] : undefined;
}
