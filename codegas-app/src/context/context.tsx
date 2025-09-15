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
  const [initializing, setInitializing] = useState(true);
  const [fcmToken, setFcmToken] = useState();

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
        if (_id) itemsToStore.push(['userId', String(_id)]);
        if (acceso) itemsToStore.push(['acceso', String(acceso)]);
        if (nombre) itemsToStore.push(['nombre', String(nombre)]);
        if (newEmail) itemsToStore.push(['email', String(newEmail)]);

        // Validar que todos los elementos sean arrays válidos
        const validItems = itemsToStore.filter(item =>
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'string' &&
          typeof item[1] === 'string'
        );

        if (validItems.length > 0) {
          await AsyncStorage.multiSet(validItems);
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
              console.log(`⚠️ Firebase not ready in context, attempt ${attempts + 1}/${maxAttempts}`);
              await new Promise(resolve => setTimeout(resolve, 500));
              attempts++;
              continue;
            }

            // Verificar que el módulo de auth esté disponible y funcional
            const authModule = auth();
            if (authModule && typeof authModule.onAuthStateChanged === 'function') {
              console.log('✅ Firebase Auth ready in context');
              const subscriber = authModule.onAuthStateChanged(onAuthStateChanged);
              return subscriber;
            } else {
              console.log(`⚠️ Auth module not ready, attempt ${attempts + 1}/${maxAttempts}`);
              await new Promise(resolve => setTimeout(resolve, 500));
              attempts++;
            }
          } catch (authError) {
            console.log(`⚠️ Auth error, attempt ${attempts + 1}/${maxAttempts}:`, authError.message);
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
          console.log('FCM Token obtained from context:', token);
        }
      } catch (error) {
        console.error('Error getting FCM token in context:', error);
      }
    };

    getFCMToken();
  }, []);

  const userFlow = {
    user: userInfo,
    userId,
    acceso: _acceso,
    nombre: _nombre,
    email: _email,
    fcmToken,
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
              console.log('Cuenta creada:', createUserResult);
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
          'tokenPhone', 'formularioChat', 'usuariosEntrando', 'fcmToken'
        ];
        await AsyncStorage.multiRemove(keysToRemove);

        // Limpiar estado del contexto
        setUserId(null);
        setAcceso(null);
        setNombre(null);
        setEmail(null);
        setFcmToken(null);

        // Cerrar sesión en Firebase
        await auth().signOut();
        console.log('Sesión cerrada y datos limpiados');
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
