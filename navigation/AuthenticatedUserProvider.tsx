import React, { useState, createContext, ReactElement, Dispatch, SetStateAction } from 'react';
import firebase from 'firebase/app';


export const AuthenticatedUserContext = createContext<{
  user?: firebase.User | null,
  setUser?: React.Dispatch<React.SetStateAction<firebase.User | null>>
}>({});

export const AuthenticatedUserProvider = ({ children }: {children: ReactElement}) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
