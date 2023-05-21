'use client'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/firebase-config";
import {SignIn} from "./types"
const DataContext = createContext({});

const DataProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState(null);

  const listenAuth = (user: any) => {
    setUser(user);
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, listenAuth);
    return () => {
      subscriber(); // unsubscribe on unmount
    };
  }, []);

  const data = {
    user,
    login: async ({email, password}: SignIn)=> {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error(error);
      }
    },
    closeSesion: async () => {
      try {
        await signOut(auth);
        setUser(null)
      } catch (error) {
        console.error(error);
      }
    }

  };

  return <DataContext.Provider value={data}> {children} </DataContext.Provider>;
};

export { DataContext, DataProvider };
