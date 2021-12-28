export type RootStackParamList = {
  Home: undefined;
  EventDetails: undefined;
  Signup: undefined;
  Login: undefined;
  History: undefined;
  CheckinTabs: undefined;
  SuccessfulCheckin: undefined;
  ProfileRegistration: { needsNric: boolean };
  ScannerFromRegistration: undefined;
  ScannerFromCheckin: undefined;
};

export type Page = keyof RootStackParamList;

export type Event = {
  title: string;
  totalScanned: number;
};
