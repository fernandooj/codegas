'use client'
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/firebase-config";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  const listenAuth = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, listenAuth);
    return () => {
      subscriber(); // unsubscribe on unmount
    };
  }, []);

  const data = {
    user,
    login: async (email, password) => {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
  };

  return <DataContext.Provider value={data}> {children} </DataContext.Provider>;
};

export { DataContext, DataProvider };
