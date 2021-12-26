import React, { useState, createContext, ReactElement } from 'react';
import {EventSummary} from '@root/utils/events.datastore';

export const EventContext = createContext<{
  event?: string,
  setEvent?: React.Dispatch<React.SetStateAction<string | undefined>>,
  events?: EventSummary[],
  setEvents?: React.Dispatch<React.SetStateAction<EventSummary[]>>,
  idHash?: string,
  setIdHash?: React.Dispatch<React.SetStateAction<string | undefined>>,
  phone?: string,
  setPhone?: React.Dispatch<React.SetStateAction<string | undefined>>,
  firstName?: string,
  setFirstName?: React.Dispatch<React.SetStateAction<string | undefined>>,
  lastName?: string,
  setLastName?: React.Dispatch<React.SetStateAction<string | undefined>>,
}>({});

function initEventContext() {
  const [event, setEvent] = useState<string | undefined>(undefined);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [idHash, setIdHash] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);

  return {
    event, setEvent,
    events, setEvents,
    idHash, setIdHash,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone
  };
}

export const CheckinProvider = ({ children }: {children: ReactElement}) => {
  return (
    <EventContext.Provider value={initEventContext()}>
      {children}
    </EventContext.Provider>
  );
};
