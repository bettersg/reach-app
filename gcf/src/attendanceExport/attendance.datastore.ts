import { initFirebaseAdmin } from '@root/initFirebaseAdmin';
import { cacheWithExpiry } from '@root/utils/cacheWithExpiry';
import moment from 'moment-timezone';

const { fs } = initFirebaseAdmin();
export const REACH_UID = 'futLaGLJNpafA9HgIdBzHjVnCro1'
// export const REACH_UID = 'jbamxRrTzmZxqRyGbCMXe53wtzI3';

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


export async function getAllEvents(): Promise<Event[]> {
    return fs
        .collection('accounts')
        .doc(REACH_UID)
        .collection('events')
        .orderBy('time', 'asc')
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

export const getExistingNricProfile = cacheWithExpiry(
    getExistingNricProfileRemotely
).cachedFunction;

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

/** For NRIC. */
export async function registerCheckin(idHash: string, eventId: string) {
    const checkin: Checkin = {
        idHash,
        eventId,
        checkinTimestamp: moment().unix(),
        identity: 'PROFILE',
    };

    await fs.collection('accounts').doc(REACH_UID).collection('checkins').doc().set(checkin);
}

export async function registerNameCheckin(name: string, phone: string, eventId: string) {
    const checkin: Checkin = {
        fullName: name,
        eventId,
        checkinTimestamp: moment().unix(),
        identity: 'NAME',
        phone,
    };

    await fs.collection('accounts').doc(REACH_UID).collection('checkins').doc().set(checkin);
}

/** If event does not yet exist, creates one for it with now as default timestamp. */
export async function createOrGetEvent(eventId: string) {
    const eventRef = fs.collection('accounts').doc(REACH_UID).collection('events').doc(eventId);

    await eventRef.get().then(async (snapshot) => {
        if (!snapshot.exists) {
            const event: Event = {
                eventId,
                time: moment.now(),
            };
            await eventRef.set(event);
        }
    });
}

export async function registerProfile(profile: Profile) {
    await fs
        .collection('accounts')
        .doc(REACH_UID)
        .collection('profiles')
        .doc(profile.idHash)
        .set(profile);
}
