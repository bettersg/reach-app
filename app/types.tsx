export type RootStackParamList = {
  Home: undefined;
  EventDetails: undefined;
  Signup: undefined;
  Login: undefined;
  History: undefined;
  CheckinTabs: undefined;
  SuccessfulCheckin: undefined;
  ProfileRegistration: { needsNric: boolean };
};

export type Page = keyof RootStackParamList;

export type Event = {
  title: string;
  totalScanned: number;
};
