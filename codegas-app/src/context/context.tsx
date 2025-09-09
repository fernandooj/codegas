import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserByUid,
  getUserByEmail,
  sendNewPassword,
  updateUid,
} from '../redux/actions/usuarioActions';
import { generate } from '@wcj/generate-password';
export const DataContext = createContext({});

const GENERATE_PASS = generate();

const DataProvider = ({ children }: any) => {
  const [userInfo, setUser] = useState();
  const [userId, setUserId] = useState();
  const [_nombre, setNombre] = useState();
  const [_acceso, setAcceso] = useState();
  const [_email, setEmail] = useState();
  const [initializing, setInitializing] = useState(true);

  const getUserInfo = async (uid: any) => {
    try {
      const userData = await getUserByUid(uid);
      console.log('Datos recibidos de getUserByUid:', userData);

      const { _id, acceso, nombre, email: newEmail } = userData || {};

      // Validar que _id existe antes de proceder
      if (!_id) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }

      // Actualizar el estado del contexto
      setUserId(_id);
      setAcceso(acceso);
      setNombre(nombre);
      setEmail(newEmail);

      // Guardar en AsyncStorage para persistencia solo si los valores no son undefined
      try {
        const itemsToStore = [];
        if (_id) itemsToStore.push(['userId', _id]);
        if (acceso) itemsToStore.push(['acceso', acceso]);
        if (nombre) itemsToStore.push(['nombre', nombre]);
        if (newEmail) itemsToStore.push(['email', newEmail]);

        if (itemsToStore.length > 0) {
          await AsyncStorage.multiSet(itemsToStore);
          console.log('Datos guardados en AsyncStorage:', { _id, acceso, nombre, email: newEmail });
        }
      } catch (error) {
        console.error('Error guardando en AsyncStorage:', error);
      }
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
    }
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

  // Función para cargar datos desde AsyncStorage al inicializar
  const loadFromAsyncStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const acceso = await AsyncStorage.getItem('acceso');
      const nombre = await AsyncStorage.getItem('nombre');
      const email = await AsyncStorage.getItem('email');

      if (userId) {
        setUserId(userId);
        setAcceso(acceso);
        setNombre(nombre);
        setEmail(email);
        console.log('Datos cargados desde AsyncStorage:', { userId, acceso, nombre, email });
      }
    } catch (error) {
      console.error('Error cargando desde AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Cargar datos desde AsyncStorage primero
    loadFromAsyncStorage();

    // Luego configurar el listener de Firebase Auth
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const userFlow = {
    user: userInfo,
    userId,
    acceso: _acceso,
    nombre: _nombre,
    email: _email,
    login: async ({ email, password }: any) => {
      try {
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        getUserInfo(user.uid);
        return {
          response: true,
          status: 1,
        };
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // La cuenta no existe
          const { status } = await getUserByEmail(email);
          if (!status) {
            return { response: false };
          } else {
            const createUserResult = await userFlow.createUserFirebase(
              email,
              GENERATE_PASS,
            );
            if (createUserResult instanceof Error) {
              console.error('Error al crear la cuenta:', createUserResult);
              return { response: false };
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
        const { user } = await auth().createUserWithEmailAndPassword(email, pass);
        return user;
      } catch (error) {
        if (error instanceof Error) {
          return (error as { code?: string }).code || 'unknown error';
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
        // Limpiar AsyncStorage usando multiRemove
        const keysToRemove = [
          'userId', 'acceso', 'nombre', 'email', 'avatar',
          'tokenPhone', 'formularioChat', 'usuariosEntrando'
        ];
        await AsyncStorage.multiRemove(keysToRemove);

        // Limpiar estado del contexto
        setUserId(null);
        setAcceso(null);
        setNombre(null);
        setEmail(null);

        // Cerrar sesión en Firebase
        await auth().signOut();
        console.log('Sesión cerrada y datos limpiados');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },
  };

  return (
    <DataContext.Provider value={userFlow}>{children}</DataContext.Provider>
  );
};

export { DataProvider };
