export type RootStackParamList = {
  Home: undefined;
  Scanner: { eventId: string };
  EventDetails: undefined;
  Signup: undefined;
  Login: undefined;
};

export type Page = keyof RootStackParamList;

export type Event = {
  title: string;
  totalScanned: number;
};

