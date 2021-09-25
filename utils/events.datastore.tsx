import moment from 'moment';
import { hash } from './cryptography';
import { initFirebase } from './initFirebaseApp';

const {fs} = initFirebase();

export interface Checkin {
  identifier: string,
  eventId: string
  checkinTimestamp: number,
  identity: 'NRIC' | 'NAME',
  phone?: string,
}

export interface EventSummary extends Event {
  numCheckins: number
}

export interface Event {
  eventId: string,
  time: number  // Epoch
}


/** Retrieves events which start +- 12 hrs from the specified epoch time (default = now) */
export async function getActiveEvents(now: number = moment.now()): Promise<Event[]> {
  const HALF_DAY_IN_MILLISECONDS = 43200000;
  return fs
    .collection('events')
    .where('time', '>=', now - HALF_DAY_IN_MILLISECONDS)
    .where('time', '<', now + HALF_DAY_IN_MILLISECONDS)
    .get()
    .then(snapshot => snapshot.docs.map((doc) => doc.data() as Event));
}

/** Retrieves the number of unique checkins to an event. */
export async function getEventSummary(event: Event): Promise<EventSummary> {
  const checkins = await fs
    .collection('checkins')
    .where('eventId', '==', event.eventId)
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data() as Checkin));

  const numCheckins = (new Set(checkins.map(checkin => checkin.identifier))).size;

  return {eventId: event.eventId, time: event.time, numCheckins};
}

/** For NRIC. */
export async function registerCheckin(nric: string, eventId: string, checkinTimestamp: number = moment.now()) {
  const checkin: Checkin = {
    identifier: await hash(nric),
    eventId,
    checkinTimestamp,
    identity: 'NRIC'
  };
  
  await fs
    .collection('checkins')
    .doc()
    .set(checkin);
}

export async function registerNameCheckin(name: string, phone: string, eventId: string, checkinTimestamp: number = moment.now()) {
  const checkin: Checkin = {
    identifier: name,
    eventId,
    checkinTimestamp,
    identity: 'NAME',
    phone
  };
  
  await fs
    .collection('checkins')
    .doc()
    .set(checkin);
}

/** Retrieves the checkins to an event. */
export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
  return fs
      .collection('checkins')
      .where('eventId', '==', eventId)
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data() as Checkin));
}

/** If event does not yet exist, creates one for it with now as default timestamp. */
export async function createOrGetEvent(eventId: string) {
  const eventRef = fs
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