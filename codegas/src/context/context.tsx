import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
  getUserByUid,
  getUserByEmail,
  sendNewPassword,
  updateUid,
} from '../redux/actions/usuarioActions';
import {generate} from '@wcj/generate-password';
export const DataContext = createContext({});

const GENERATE_PASS = generate();

const DataProvider = ({children}: any) => {
  const [userInfo, setUser] = useState();
  const [userId, setUserId] = useState();
  const [_nombre, setNombre] = useState();
  const [_acceso, setAcceso] = useState();
  const [_email, setEmail] = useState();
  const [initializing, setInitializing] = useState(true);

  const getUserInfo = async (uid: any) => {
    const {_id, acceso, nombre, email: newEmail} = await getUserByUid(uid);

    setUserId(_id);
    setAcceso(acceso);
    setNombre(nombre);
    setEmail(newEmail);
  };
  const onAuthStateChanged = async (user: any) => {
    setUser(user);
    if (user) {
      getUserInfo(user.uid);
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
    nombre: _nombre,
    email: _email,
    login: async ({email, password}: any) => {
      try {
        const {user} = await auth().signInWithEmailAndPassword(email, password);
        getUserInfo(user.uid);
        return {
          response: true,
          status: 1,
        };
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // La cuenta no existe
          const {status} = await getUserByEmail(email);
          if (!status) {
            return {response: false};
          } else {
            const createUserResult = await userFlow.createUserFirebase(
              email,
              GENERATE_PASS,
            );
            if (createUserResult instanceof Error) {
              console.error('Error al crear la cuenta:', createUserResult);
              return {response: false};
            } else {
              console.log('Cuenta creada:', createUserResult);
              await sendNewPassword(email, GENERATE_PASS);
              await updateUid(email, createUserResult.uid)
              return {
                response: true,
                status: 2,
              };
            }
          }
        } else {
          // Otro tipo de error
          console.log('Error al iniciar sesión:', error?.message);
        }
        return false;
      }
    },
    createUserFirebase: async (email: string, pass: string) => {
      try {
        const {user} = await auth().createUserWithEmailAndPassword(email, pass);
        return user;
      } catch (error) {
        if (error instanceof Error) {
          return (error as {code?: string}).code || 'unknown error';
        } else {
          return 'unknown error';
        }
      }
    },
    recoverPass: async (email: string) => {
      try {
        // const emailAddress = typeof email === 'string' ? email : email.email;
        await auth().sendPasswordResetEmail(email);
      } catch (error) {
        console.error(error);
      }
    },
    cerrarSesion: async () => {
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
