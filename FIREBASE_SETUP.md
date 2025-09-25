# Firebase Cloud Messaging (FCM) Setup

Este documento describe la configuración completa de Firebase Cloud Messaging para la aplicación Codegas.

## ✅ Configuración Completada

### 1. Dependencias instaladas
- `@react-native-firebase/app: ^18.9.0`
- `@react-native-firebase/auth: ^18.9.0`
- `@react-native-firebase/messaging: ^18.9.0`

### 2. Configuración Android
- ✅ `google-services` plugin agregado al `build.gradle` del proyecto
- ✅ Firebase BOM y dependencias agregadas al `build.gradle` de la app
- ✅ Permisos de notificación agregados al `AndroidManifest.xml`
- ✅ Servicio `MyFirebaseMessagingService` creado
- ✅ Recursos de notificación (iconos, colores, strings) configurados

### 3. Configuración iOS
- ✅ Firebase configurado en `Podfile`
- ✅ `AppDelegate.swift` configurado con Firebase y notificaciones push
- ✅ `GoogleService-Info.plist` presente

### 4. Implementación React Native
- ✅ `pushNotificationService.js` ya existía y está completamente configurado
- ✅ Inicialización automática en `App.tsx`
- ✅ Manejo de tokens FCM
- ✅ Listeners para notificaciones en primer plano y segundo plano

### 5. Backend API
- ✅ Endpoint `POST /users/fcm-token` creado
- ✅ Función para actualizar token FCM en la base de datos
- ✅ Configurado en `services/users/serverless.yml`

## 🔧 Archivos Modificados/Creados

### Android
- `android/build.gradle` - Agregado google-services plugin
- `android/app/build.gradle` - Firebase dependencies y plugin
- `android/app/src/main/AndroidManifest.xml` - Permisos y configuración
- `android/app/src/main/java/com/codegas/MyFirebaseMessagingService.java` - Servicio FCM
- `android/app/src/main/res/drawable/ic_notification.xml` - Icono notificación
- `android/app/src/main/res/values/strings.xml` - Strings de notificación
- `android/app/src/main/res/values/colors.xml` - Colores de notificación

### React Native
- `App.tsx` - Inicialización del servicio de notificaciones
- `src/services/pushNotificationService.js` - Actualizado endpoint FCM

### Backend
- `api/services/users/src/update-fcm-token.js` - Nuevo endpoint
- `api/services/users/serverless.yml` - Configuración del endpoint

## 🚀 Próximos Pasos

### ✅ Ya Completado
- Firebase SDK instalado y configurado
- iOS completamente configurado con GoogleService-Info.plist
- Pods instalados correctamente
- Servicios de notificación implementados
- Backend endpoint creado

### 📋 Pendiente por Hacer

1. **CRÍTICO: Archivo google-services.json para Android**
   ```bash
   # Necesitas descargar desde Firebase Console:
   # https://console.firebase.google.com
   # Proyecto -> Configuración -> Agregar app Android
   # Colocar el archivo en: android/app/google-services.json
   ```

2. **Reiniciar servidor backend** para activar nuevo endpoint:
   ```bash
   cd api && npm start
   # O si usas serverless offline:
   cd api && npx serverless offline
   ```

3. **Probar en dispositivo físico**:
   ```bash
   # iOS
   npx react-native run-ios --device
   
   # Android (después de agregar google-services.json)
   npx react-native run-android
   ```

### 🧪 Archivo de Prueba Creado
- `TestFirebase.js` - Prueba automática que se ejecuta al iniciar la app
- Verificará que Firebase esté correctamente instalado
- Mostrará logs detallados en la consola de desarrollo

## 📱 Uso del Servicio

### Inicializar notificaciones
```javascript
import pushNotificationService from './src/services/pushNotificationService';

// Se inicializa automáticamente en App.tsx
pushNotificationService.initialize();
```

### Enviar token al backend
```javascript
// Después de que el usuario se loguee
const userId = 123;
await pushNotificationService.sendTokenToBackend(userId);
```

### Notificaciones de prueba
```javascript
// Enviar notificación de prueba local
pushNotificationService.sendTestNotification();

// Enviar notificación de pedido
pushNotificationService.sendTestOrderNotification('12345', '2025-09-18');
```

## 🐛 Solución de Problemas

### Error "database ferortiz does not exist"
- Esto ocurre cuando las variables de entorno no se cargan correctamente
- Verificar que el archivo `.env` en `api/` contenga las variables correctas
- El servicio de notificaciones del backend funciona correctamente una vez configurada la BD

### Token FCM no se obtiene
- Verificar permisos de notificación
- Usar dispositivo físico (no simulador)
- Verificar configuración de Firebase

### Notificaciones no llegan
- Verificar que el token se guarde correctamente en la BD
- Usar Firebase Console para enviar notificaciones de prueba
- Verificar que la app esté configurada en Firebase

## 🔗 Endpoints API

### Actualizar Token FCM
```
POST /users/fcm-token
Content-Type: application/json

{
  "userId": 123,
  "fcmToken": "token_fcm_aqui"
}
```

### Notificar Pedidos 3 Días
```
GET /fre/notificar-pedidos-3-dias
```

Este endpoint ya funciona y enviará notificaciones usando los tokens FCM almacenados en la base de datos.
