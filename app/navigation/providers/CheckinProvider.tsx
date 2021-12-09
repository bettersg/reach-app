import React, { useState, createContext, ReactElement } from 'react';
import {EventSummary} from '@root/utils/events.datastore';


export const EventContext = createContext<{
  event?: string,
  setEvent?: React.Dispatch<React.SetStateAction<string | undefined>>
  events?: EventSummary[],
  setEvents?: React.Dispatch<React.SetStateAction<EventSummary[]>>,
  idHash?: string,
  setIdHash?: React.Dispatch<React.SetStateAction<string | undefined>>,
  name?: string,
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
}>({});

export const CheckinProvider = ({ children }: {children: ReactElement}) => {
  const [event, setEvent] = useState<string | undefined>(undefined);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [idHash, setIdHash] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  return (
    <EventContext.Provider value={{ event, setEvent, events, setEvents, idHash, setIdHash, name, setName }}>
      {children}
    </EventContext.Provider>
  );
};
