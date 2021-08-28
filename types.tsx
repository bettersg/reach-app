export type RootStackParamList = {
  Home: undefined;
  Scanner: { eventId: string };
  EventDetails: undefined;
};

export type Page = keyof RootStackParamList;

export type Event = {
  title: string;
  totalScanned: number;
};
