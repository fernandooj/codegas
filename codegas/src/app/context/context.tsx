'use client'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { getUserByUid } from "../store/fetch-user";
import { auth } from "../utils/firebase/firebase-config";
import {SignIn} from "./types"
const DataContext = createContext({});

const DataProvider = ({ children }: {children: React.ReactNode}) => {
  const [userData, setUser] = useState(null);
 
  
 
  const listenAuth = (user: any) => {
    if (localStorage.getItem(`user`)){
      console.log("si")
      setUser(JSON.parse(localStorage.getItem(`user`)));
    }
    else{
      console.log("no")
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
    idUser: JSON.parse(localStorage.getItem(`idUser`)),
    user: userData,
    login: async ({email, password}: SignIn)=> {
      try {
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        const {_id} = await getUserByUid(user.uid)
    
        localStorage.setItem(`user`, JSON.stringify(user));
        localStorage.setItem(`idUser`, JSON.stringify(_id));
        setUser(user)
      } catch (error) {
        console.error(error);
      }
    },
    closeSesion: async () => {
      try {
        await signOut(auth);
        setUser(null)
        localStorage.removeItem('user');
 
      } catch (error) {
        console.error(error);
      }
    },
    createUserFirebase: async (email: any) => {
      try {
        const {user} = await createUserWithEmailAndPassword(auth, email, "aef*/aef")
        
        return user
      } catch (error) {
        return error.code;
      }
    }
  };

  return <DataContext.Provider value={data}> {children} </DataContext.Provider>;
};

export { DataContext, DataProvider };
