import { initFirebaseAdmin } from '@root/initFirebaseAdmin';
import { cacheWithExpiry } from '@root/utils/cacheWithExpiry';
import moment from 'moment-timezone';

const { fs } = initFirebaseAdmin();

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

/** Retrieves events which start +- 12 hrs from the specified epoch time (default = now) */
export async function getActiveEvents(now: number = moment.now()): Promise<Event[]> {
    const HALF_DAY_IN_MILLISECONDS = 43200000;
    const WEEK_IN_MILLISECONDS = 604800000;
    return fs
        .collection('events')
        .where('time', '>=', now - WEEK_IN_MILLISECONDS)
        .where('time', '<', now + HALF_DAY_IN_MILLISECONDS)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Event));
}

/** Retrieves the number of unique checkins to an event. */
export async function getEventSummary(event: Event): Promise<EventSummary> {
    const checkins = await fs
        .collection('checkins')
        .where('eventId', '==', event.eventId)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Checkin));

    const nameCheckins = checkins
        .filter((checkin) => checkin.identity === 'NAME')
        .map((checkin) => (checkin as NameCheckin).fullName);

    const profileCheckins = checkins
        .filter((checkin) => checkin.identity === 'PROFILE')
        .map((checkin) => (checkin as ProfileCheckin).idHash);

    const numCheckins = new Set(nameCheckins).size + new Set(profileCheckins).size;

    return { eventId: event.eventId, time: event.time, numCheckins };
}

/** For NRIC. */
export async function registerCheckin(
    idHash: string,
    eventId: string,
    checkinTimestamp: number = moment().unix()
) {
    const checkin: Checkin = {
        idHash,
        eventId,
        checkinTimestamp,
        identity: 'PROFILE',
    };

    await fs.collection('checkins').doc().set(checkin);
}

export async function registerNameCheckin(
    name: string,
    phone: string,
    eventId: string,
    checkinTimestamp: number = moment().unix()
) {
    const checkin: Checkin = {
        fullName: name,
        eventId,
        checkinTimestamp,
        identity: 'NAME',
        phone,
    };

    await fs.collection('checkins').doc().set(checkin);
}

/** Retrieves the checkins to an event. */
export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
    return fs
        .collection('checkins')
        .where('eventId', '==', eventId)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Checkin));
}

export async function getEventsOnDate(date: moment.Moment): Promise<Event[]> {
    return fs
        .collection('events')
        .where('time', '>=', date.startOf('day').unix() * 1000)
        .where('time', '<=', date.endOf('day').unix() * 1000)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Event));
}

/** If event does not yet exist, creates one for it with now as default timestamp. */
export async function createOrGetEvent(eventId: string) {
    const eventRef = fs.collection('events').doc(eventId);

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

export interface Profile {
    idHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: number; // moment().unix()
}

export async function registerProfile(profile: Profile) {
    await fs.collection('profiles').doc(profile.idHash).set(profile);
}

async function getExistingNricProfileRemotely(idHash: string): Promise<Profile | undefined> {
    try {
        return fs
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
        .collection('profiles')
        .where('firstName', '==', firstName)
        .where('lastName', '==', lastName)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Profile));

    return matches.length > 0 ? matches[0] : undefined;
}