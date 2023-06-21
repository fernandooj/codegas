import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {getUserByUid} from '../redux/actions/usuarioActions';
export const DataContext = createContext({});

const DataProvider = ({children}: any) => {
  const [userInfo, setUser] = useState();
  const [userId, setUserId] = useState();
  const [_acceso, setAcceso] = useState();
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = async (user: any) => {
    setUser(user);
    if (user) {
      const {_id, acceso} = await getUserByUid(user.uid);
      setUserId(_id);
      setAcceso(acceso);
    }
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const userFlow = {
    user: userInfo,
    userId,
    acceso: _acceso,
    login: async ({email, password}: any) => {
      try {
        const {user} = await auth().signInWithEmailAndPassword(email, password);
        const {_id, acceso} = await getUserByUid(user.uid);
        setUserId(_id);
        setAcceso(acceso);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    register: async (email: string, password: string) => {
      try {
        auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.error(error);
      }
    },
    logOut: async () => {
      try {
        auth().signOut();
      } catch (error) {
        console.error(error);
      }
    },
  };

  return (
    <DataContext.Provider value={userFlow}>{children}</DataContext.Provider>
  );
};

export {DataProvider};
