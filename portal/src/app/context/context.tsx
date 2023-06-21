'use client'
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { getUserByUid } from "../store/fetch-user";
import { auth } from "../utils/firebase/firebase-config";
import {SignInProps, DataProps} from "./types"
 

const DataContext = createContext<DataProps>({
  idUser: null,
  acceso: null,
  user: null,
  login: async () => {},
  closeSesion: async () => {},
  createUserFirebase: async () => {
    throw new Error("createUserFirebase is not implemented");
  },
});

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUser] = useState<User | null>(null);
  const [idUser, setIdUser] = useState<string | null>(null);
  const [acceso, setAcceso] = useState<string | null>(null);

  const listenAuth = (user: User | null) => {
    if (typeof window !== "undefined" && localStorage.getItem("user")) {
      setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : user);
      setIdUser(localStorage.getItem("idUser") ? JSON.parse(localStorage.getItem("idUser")!) : idUser);
      setAcceso(localStorage.getItem("acceso") ? localStorage.getItem("acceso")! : acceso);
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

  const data: DataProps = {
    idUser: idUser ? idUser : typeof window !== "undefined" ? localStorage.getItem("idUser") : null,
    acceso: acceso ? acceso : typeof window !== "undefined" ? localStorage.getItem("acceso") : null,
    user: userData,
    login: async ({ email, password }: SignInProps) => {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const { _id, acceso } = await getUserByUid(user.uid);
    
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("idUser", JSON.stringify(_id));
          localStorage.setItem("acceso", acceso);
        }
      
        setUser(user);
        setIdUser(_id);
        setAcceso(acceso);
      } catch (error) {
        console.error(error);
      }
    },
    closeSesion: async () => {
      try {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("idUser");
        localStorage.removeItem("acceso");
      } catch (error) {
        console.error(error);
      }
    },
    createUserFirebase: async (email: string) => {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, "aef*/aef");
        return user;
      } catch (error) {
        if (error instanceof Error) {
          return (error as { code?: string }).code || "unknown error";
        } else {
          return "unknown error";
        }
      }
    }
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export { DataContext, DataProvider };
