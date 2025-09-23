import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { getApps, getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserByUid,
  getUserByEmail,
  sendNewPassword,
  updateUid,
} from '../redux/actions/usuarioActions';
import pushNotificationService from '../services/pushNotificationService';
import { generate } from '@wcj/generate-password';
export const DataContext = createContext({});

const DataProvider = ({ children }: any) => {
  const [userInfo, setUser] = useState();
  const [userId, setUserId] = useState();
  const [_nombre, setNombre] = useState();
  const [_acceso, setAcceso] = useState();
  const [_email, setEmail] = useState();
  const [_avatar, setAvatar] = useState();
  const [initializing, setInitializing] = useState(true);
  const [fcmToken, setFcmToken] = useState();

  const getUserInfo = async (uid: any) => {
    try {
      const userData = await getUserByUid(uid);

      const { _id, acceso, nombre, email: newEmail, avatar } = userData || {};

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
      setAvatar(avatar);

      // Guardar en AsyncStorage para persistencia solo si los valores no son undefined
      try {
        const itemsToStore = [];
        if (_id) itemsToStore.push(['userId', String(_id)]);
        if (acceso) itemsToStore.push(['acceso', String(acceso)]);
        if (nombre) itemsToStore.push(['nombre', String(nombre)]);
        if (newEmail) itemsToStore.push(['email', String(newEmail)]);
        if (avatar) itemsToStore.push(['avatar', String(avatar)]);

        // Validar que todos los elementos sean arrays válidos
        const validItems = itemsToStore.filter(item =>
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'string' &&
          typeof item[1] === 'string'
        );

        if (validItems.length > 0) {
          await AsyncStorage.multiSet(validItems);
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
      const avatar = await AsyncStorage.getItem('avatar');

      if (userId) {
        setUserId(userId);
        setAcceso(acceso);
        setNombre(nombre);
        setEmail(email);
        setAvatar(avatar);
      }
    } catch (error) {
      console.error('Error cargando desde AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Cargar datos desde AsyncStorage primero
    loadFromAsyncStorage();

    // Configurar el listener de Firebase Auth con verificación robusta
    const setupAuth = async () => {
      try {
        // Esperar más tiempo para que Firebase esté completamente listo
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          try {
            // Verificar que Firebase esté completamente inicializado
            if (getApps().length === 0) {
              await new Promise(resolve => setTimeout(resolve, 500));
              attempts++;
              continue;
            }

            // Verificar que el módulo de auth esté disponible y funcional
            const authModule = auth();
            if (authModule && typeof authModule.onAuthStateChanged === 'function') {
              const subscriber = authModule.onAuthStateChanged(onAuthStateChanged);
              return subscriber;
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
              attempts++;
            }
          } catch (authError) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
          }
        }

        console.error('❌ Failed to initialize Firebase Auth after maximum attempts');
        return null;
      } catch (error) {
        console.error('Error setting up Firebase Auth in context:', error);
        return null;
      }
    };

    let subscriber = null;
    setupAuth().then(result => {
      subscriber = result;
    });

    return () => {
      if (subscriber && typeof subscriber === 'function') {
        subscriber();
      }
    };
  }, []);

  // Obtener FCM token después de que el servicio esté inicializado
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        // Wait a bit to ensure push notification service is initialized
        await new Promise(resolve => setTimeout(resolve, 2000));

        const token = pushNotificationService.getCurrentToken();
        if (token) {
          setFcmToken(token);
          await AsyncStorage.setItem('fcmToken', token);
        } else {
        }
      } catch (error) {
        console.error('Error getting FCM token in context:', error);
      }
    };

    getFCMToken();
  }, []);

  // Función para actualizar los datos del usuario en el contexto
  const updateUserData = async (newUserData: any) => {
    try {
      const { nombre, email, avatar } = newUserData;

      // Actualizar estado del contexto
      if (nombre !== undefined && nombre !== null) {
        setNombre(nombre);
      }
      if (email !== undefined && email !== null) {
        setEmail(email);
      }
      if (avatar !== undefined && avatar !== null) {
        setAvatar(avatar);
      }

      // Actualizar AsyncStorage
      const itemsToUpdate = [];
      if (nombre !== undefined && nombre !== null) itemsToUpdate.push(['nombre', String(nombre)]);
      if (email !== undefined && email !== null) itemsToUpdate.push(['email', String(email)]);
      if (avatar !== undefined && avatar !== null) itemsToUpdate.push(['avatar', String(avatar)]);

      if (itemsToUpdate.length > 0) {
        await AsyncStorage.multiSet(itemsToUpdate);
      }
    } catch (error) {
      console.error('❌ Error actualizando datos del usuario:', error);
    }
  };

  const userFlow = {
    user: userInfo,
    userId,
    acceso: _acceso,
    nombre: _nombre,
    email: _email,
    avatar: _avatar,
    fcmToken,
    updateUserData,
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
            const generatedPassword = generate();
            const createUserResult = await userFlow.createUserFirebase(
              email,
              generatedPassword,
            );
            if (createUserResult instanceof Error) {
              console.error('Error al crear la cuenta:', createUserResult);
              return { response: false };
            } else {
              await sendNewPassword(email, generatedPassword);
              await updateUid(email, createUserResult.uid)
              return {
                response: true,
                status: 2,
              };
            }
          }
        } else {
          // Otro tipo de error
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
          'tokenPhone', 'formularioChat', 'usuariosEntrando', 'fcmToken'
        ];
        await AsyncStorage.multiRemove(keysToRemove);

        // Limpiar estado del contexto
        setUserId(null);
        setAcceso(null);
        setNombre(null);
        setEmail(null);
        setAvatar(null);
        setFcmToken(null);

        // Cerrar sesión en Firebase
        await auth().signOut();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },
    sendFCMTokenToBackend: async (userId: any) => {
      try {
        if (fcmToken && userId) {
          await pushNotificationService.sendTokenToBackend(userId);
        }
      } catch (error) {
        console.error('Error sending FCM token to backend:', error);
      }
    },
  };

  return (
    <DataContext.Provider value={userFlow}>{children}</DataContext.Provider>
  );
};

export { DataProvider };
