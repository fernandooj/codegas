# CodeGas App

**CodeGas** es una aplicación móvil desarrollada en React Native para la gestión integral de servicios de gas. La aplicación está diseñada para facilitar la administración de tanques, pedidos, vehículos, revisiones de seguridad y reportes de emergencia en el sector gasífero.

## 🚀 Características Principales

### 📋 Gestión de Pedidos
- Creación y edición de pedidos de gas
- Seguimiento de pedidos en tiempo real
- Gestión de frecuencias de entrega
- Sistema de calificaciones

### 🚛 Gestión de Vehículos
- Administración de flota vehicular
- Asignación de conductores
- Control de placas y centros de costos
- Vinculación/desvinculación de personal

### 🛢️ Gestión de Tanques
- Registro y control de tanques de gas
- Revisiones de seguridad periódicas
- Control de capacidad y fabricante
- Gestión de ubicaciones y sectores

### 👥 Gestión de Usuarios
- Sistema de perfiles con diferentes niveles de acceso
- Roles: Administrador, Conductor, Cliente, Inspector de Seguridad, etc.
- Gestión de permisos y accesos

### 📊 Reportes y Análisis
- Reportes de emergencia
- Gráficos y estadísticas
- Control de revisiones
- Documentación PDF

### 🔧 Funcionalidades Técnicas
- Captura de fotos y documentos
- Geolocalización
- Notificaciones push
- Sincronización en tiempo real
- Sistema de chat interno

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.81.1
- **React** 19.1.0
- **Redux** para manejo de estado
- **React Navigation** para navegación
- **Axios** para peticiones HTTP
- **AsyncStorage** para almacenamiento local
- **Socket.io** para comunicación en tiempo real
- **Moment.js** para manejo de fechas
- **React Native Responsive** para diseño adaptativo

## 📱 Requisitos del Sistema

- **Node.js** >= 20
- **React Native CLI**
- **Android Studio** (para Android)
- **Xcode** (para iOS)
- **CocoaPods** (para iOS)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd codegas-app
```

### 2. Instalar Dependencias
```bash
# Instalar dependencias de Node.js
npm install
# o
yarn install
```

### 3. Configuración para iOS
```bash
# Instalar dependencias de Ruby (primera vez)
bundle install

# Instalar dependencias de CocoaPods
cd ios
bundle exec pod install
cd ..
```

### 4. Configuración de Variables de Entorno
La aplicación se conecta a la API en `https://appcodegas.com`. Si necesitas cambiar la URL, modifica el archivo `App.tsx`:

```javascript
export const URL = 'https://appcodegas.com'; // URL de producción
// export const URL = 'http://127.0.0.1:8181'; // URL local para desarrollo
```

## 🏃‍♂️ Ejecutar la Aplicación

### Iniciar Metro Bundler
```bash
# Iniciar el servidor de desarrollo
npm start
# o
yarn start

# Para limpiar caché (si hay problemas)
npm start -- --reset-cache
# o
yarn start --reset-cache
```

### Ejecutar en Android
```bash
# En una nueva terminal
npm run android
# o
yarn android
```

### Ejecutar en iOS
```bash
# En una nueva terminal
npm run ios
# o
yarn ios
```

## 📁 Estructura del Proyecto

```
src/
├── pages/                 # Pantallas de la aplicación
│   ├── home/             # Pantalla principal
│   ├── pedido/           # Gestión de pedidos
│   ├── vehiculo/         # Gestión de vehículos
│   ├── tanques/          # Gestión de tanques
│   ├── revision/         # Revisiones de seguridad
│   ├── perfil/           # Perfiles de usuario
│   ├── usuarios/         # Gestión de usuarios
│   ├── reporteEmergencia/ # Reportes de emergencia
│   └── ...
├── components/           # Componentes reutilizables
├── redux/               # Configuración de Redux
├── routes/              # Configuración de navegación
└── assets/              # Recursos (imágenes, etc.)
```

## 🔧 Scripts Disponibles

```bash
npm run android          # Ejecutar en Android
npm run ios             # Ejecutar en iOS
npm start              # Iniciar Metro bundler
npm run lint           # Ejecutar linter
npm test               # Ejecutar tests
```

## 🐛 Solución de Problemas

### Error de MediaQueryStyleSheet
Si encuentras errores relacionados con `MediaQueryStyleSheet`, asegúrate de que todos los archivos de estilo tengan el import correcto:

```javascript
import { MediaQueryStyleSheet } from 'react-native-responsive';
```

### Limpiar Caché
Si la aplicación no se actualiza correctamente:

```bash
# Limpiar caché de Metro
npm start -- --reset-cache

# Limpiar caché de React Native
npx react-native start --reset-cache

# Para iOS, limpiar también CocoaPods
cd ios && bundle exec pod install && cd ..
```

### Problemas de Dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install

# Para iOS, reinstalar pods
cd ios
rm -rf Pods
bundle exec pod install
cd ..
```

## 📱 Niveles de Acceso

La aplicación maneja diferentes niveles de acceso:

- **Administrador**: Acceso completo a todas las funcionalidades
- **Conductor**: Gestión de pedidos y vehículos
- **Cliente**: Visualización de pedidos y reportes
- **Inspector de Seguridad**: Revisiones y reportes de emergencia
- **Departamento Técnico**: Gestión técnica de tanques
- **Comercial**: Gestión comercial y de clientes

## 🔗 API y Backend

La aplicación se conecta a una API REST en `https://appcodegas.com/x/v1` que maneja:

- Autenticación de usuarios
- Gestión de datos de la aplicación
- Sincronización en tiempo real
- Almacenamiento de archivos e imágenes

## 📄 Licencia

Este proyecto es privado y está destinado para uso interno de CodeGas.

## 🤝 Contribución

Para contribuir al proyecto, por favor contacta al equipo de desarrollo.

## 📞 Soporte

Para soporte técnico o reportar bugs, contacta al equipo de desarrollo de CodeGas.

---

**Versión**: 1.0.0  
**Última actualización**: 2024
