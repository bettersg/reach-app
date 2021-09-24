import React, { useState, createContext, ReactElement } from 'react';
import {EventSummary} from '@root/utils/events.datastore';


export const EventContext = createContext<{
  event?: string,
  setEvent?: React.Dispatch<React.SetStateAction<string>>
  events?: EventSummary[],
  setEvents?: React.Dispatch<React.SetStateAction<EventSummary[]>>
}>({});

export const EventProvider = ({ children }: {children: ReactElement}) => {
  const [event, setEvent] = useState('');
  const [events, setEvents] = useState<EventSummary[]>([]);

  return (
    <EventContext.Provider value={{ event, setEvent, events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
