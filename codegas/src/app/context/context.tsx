'use client'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { getUserByUid } from "../store/fetch-user";
import { auth } from "../utils/firebase/firebase-config";
import {SignIn} from "./types"
const DataContext = createContext({});

const DataProvider = ({ children }: {children: React.ReactNode}) => {
  const [userData, setUser] = useState<User | null>(null);
  const [idUser, setIdUser] = useState(null);
  const [acceso, setAcceso] = useState(null);
 
  const listenAuth = (user: any) => {
    if (typeof window !== "undefined" && localStorage.getItem(`user`)) {
      setUser(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : user);

    } else {
      setUser(user);
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, listenAuth);
    return () => {
      subscriber(); // unsubscribe on unmount
    };
  }, []);

  const data = {
    idUser: idUser ?idUser :typeof window !== 'undefined' ? localStorage.getItem('idUser') : null,
    acceso: acceso ?acceso :typeof window !== 'undefined' ? localStorage.getItem('acceso') : null,
    user: userData,
    login: async ({email, password}: SignIn)=> {
      try {
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        const {_id, acceso} = await getUserByUid(user.uid)
    
        if (typeof window !== "undefined") {
          localStorage.setItem(`user`, JSON.stringify(user));
          localStorage.setItem(`idUser`, JSON.stringify(_id));
          localStorage.setItem(`acceso`, (acceso));
        }
        setUser(user)
        setIdUser(_id)
        setAcceso(acceso)
      } catch (error) {
        console.error(error);
      }
    },
    closeSesion: async () => {
      try {
        await signOut(auth);
        setUser(null)
        localStorage.removeItem('user');
        localStorage.removeItem('idUser');
        localStorage.removeItem('acceso');
 
      } catch (error) {
        console.error(error);
      }
    },
    createUserFirebase: async (email: any) => {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, 'aef*/aef');
        return user;
      } catch (error) {
        if (error instanceof Error) {
          return (error as { code?: string }).code || 'unknown error';
        } else {
          return 'unknown error';
        }
      }
    }
  };

  return <DataContext.Provider value={data}> {children} </DataContext.Provider>;
};

export { DataContext, DataProvider };
