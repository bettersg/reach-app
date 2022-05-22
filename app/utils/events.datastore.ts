import { myUid } from '@root/navigation/uidHolder';
import moment from 'moment-timezone';
import { initFirebase } from './initFirebaseApp';

const {fs} = initFirebase();
export type Checkin = ProfileCheckin | NameCheckin;

export interface NameCheckin {
  eventId: string
  checkinTimestamp: number,
  identity: 'NAME',
  fullName: string,
  phone: string,
}

export interface ProfileCheckin {
  eventId: string
  checkinTimestamp: number,
  identity: 'PROFILE',
  idHash: string,
}

export interface EventSummary extends Event {
  numCheckins: number
}

export interface Event {
  eventId: string,
  time: number  // Epoch
}


/** Retrieves the number of unique checkins to an event. */
export async function getEventSummary(event: Event): Promise<EventSummary> {
  const checkins = await fs
    .collection('accounts')
    .doc(myUid)
    .collection('checkins')
    .where('eventId', '==', event.eventId)
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data() as Checkin));

  const nameCheckins = checkins
    .filter(checkin => checkin.identity === 'NAME')
    .map(checkin => (checkin as NameCheckin).fullName);

  const profileCheckins = checkins
    .filter(checkin => checkin.identity === 'PROFILE')
    .map(checkin => (checkin as ProfileCheckin).idHash);
  
  const numCheckins = (new Set(nameCheckins)).size + (new Set(profileCheckins)).size;

  return {eventId: event.eventId, time: event.time, numCheckins};
}

/** For NRIC. */
export async function registerCheckin(idHash: string, eventId: string) {
  const checkin: Checkin = {
    idHash,
    eventId,
    checkinTimestamp: moment().unix(),
    identity: 'PROFILE'
  };
  
  await fs
    .collection('accounts')
    .doc(myUid)
    .collection('checkins')
    .doc()
    .set(checkin);
}

export async function registerNameCheckin(name: string, phone: string, eventId: string) {
  const checkin: Checkin = {
    fullName: name,
    eventId,
    checkinTimestamp: moment().unix(),
    identity: 'NAME',
    phone
  };
  
  await fs
    .collection('accounts')
    .doc(myUid)
    .collection('checkins')
    .doc()
    .set(checkin);
}

/** If event does not yet exist, creates one for it with now as default timestamp. */
export async function createOrGetEvent(eventId: string) {
  const eventRef = fs
    .collection('accounts')
    .doc(myUid)
    .collection('events')
    .doc(eventId);

  await eventRef
    .get()
    .then(async (snapshot) => {
      if (!snapshot.exists) {
        const event: Event = {
          eventId,
          time: moment.now()
        };
        await eventRef.set(event);
      }
    });
}

export async function getEventsOnDate(date: moment.Moment): Promise<Event[]> {
  return fs
    .collection('accounts')
    .doc(myUid) 
    .collection('events')
    .where('time', '>=', date.startOf('day').unix()* 1000)
    .where('time', '<=', date.endOf('day').unix() * 1000)
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Event));
}