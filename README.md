# 🚀 Codegas - Sistema de Gestión de Gas

Sistema completo de gestión de distribución de gas que incluye una aplicación móvil React Native y un backend serverless con API REST.

## 📁 Estructura del Proyecto

```
codegas/
├── codegas-app/          # 📱 Aplicación móvil React Native
├── api/                  # 🔧 Backend serverless (AWS Lambda)
├── back/                 # 🖥️ Backend tradicional (Node.js + Express)
├── rds/                  # 🗄️ Scripts de base de datos PostgreSQL
└── README.md
```

---

## 📱 **codegas-app** - Aplicación Móvil React Native

### 🎯 **Descripción**
Aplicación móvil multiplataforma (iOS/Android) para la gestión de distribución de gas, desarrollada con React Native 0.81.

### ✨ **Funcionalidades Principales**

#### 👤 **Gestión de Usuarios**
- **Autenticación**: Login/logout con Firebase Auth
- **Perfiles de Usuario**: Clientes, conductores, administradores
- **Edición de Perfil**: Modificar datos personales y profesionales
- **Gestión de Ubicaciones**: Crear y administrar puntos de entrega

#### 📦 **Gestión de Pedidos**
- **Crear Pedidos**: Nuevos pedidos con especificaciones detalladas
- **Seguimiento**: Estado en tiempo real de pedidos
- **Cierre de Pedidos**: Finalización con validaciones
- **Historial**: Consulta de pedidos anteriores

#### 🚛 **Gestión de Vehículos**
- **Registro de Vehículos**: Información técnica y documentación
- **Asignación de Conductores**: Vinculación conductor-vehículo
- **Mantenimiento**: Registro de revisiones y servicios

#### 📍 **Gestión de Ubicaciones**
- **Puntos de Entrega**: Creación y edición de ubicaciones
- **Zonas de Distribución**: Organización geográfica
- **Rutas**: Optimización de entregas

#### 🚨 **Reportes de Emergencia**
- **Alertas**: Sistema de notificaciones de emergencia
- **Documentación**: Registro fotográfico y descripción
- **Seguimiento**: Estado de resolución

#### 📊 **Reportes e Informes**
- **Dashboard**: Métricas y KPIs principales
- **Gráficos**: Visualización de datos de ventas
- **Exportación**: Generación de PDFs

### 🛠️ **Tecnologías**

- **React Native 0.81** - Framework móvil
- **TypeScript** - Tipado estático
- **Redux** - Gestión de estado
- **Firebase** - Autenticación y notificaciones push
- **React Navigation** - Navegación
- **React Native Vector Icons** - Iconografía
- **React Native Image Picker** - Gestión de imágenes
- **React Native PDF** - Visualización de documentos

### 📦 **Instalación y Desarrollo**

```bash
# Instalar dependencias
cd codegas-app
npm install
# o
yarn install

# iOS (macOS únicamente)
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### 🏗️ **Build de Producción**

```bash
# Android APK optimizado
./scripts/build-optimized.sh

# iOS
npx react-native run-ios --configuration Release
```

---

## 🔧 **api/** - Backend Serverless

### 🎯 **Descripción**
API REST serverless desarrollada con Serverless Framework y AWS Lambda para escalabilidad y eficiencia de costos.

### ✨ **Servicios Disponibles**

#### 👥 **Users Service**
- `POST /users` - Crear usuario
- `GET /users/{id}` - Obtener usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario
- `POST /users/login` - Autenticación
- `POST /users/forgot-password` - Recuperar contraseña

#### 📦 **Pedidos Service**
- `POST /pedidos` - Crear pedido
- `GET /pedidos` - Listar pedidos
- `PUT /pedidos/{id}` - Actualizar pedido
- `POST /pedidos/{id}/asignar-conductor` - Asignar conductor
- `POST /pedidos/{id}/cerrar` - Cerrar pedido

#### 🚛 **Vehículos Service**
- `POST /vehiculos` - Crear vehículo
- `GET /vehiculos` - Listar vehículos
- `PUT /vehiculos/{id}` - Actualizar vehículo
- `DELETE /vehiculos/{id}` - Eliminar vehículo

#### 📍 **Puntos Service**
- `POST /puntos` - Crear punto de entrega
- `GET /puntos` - Listar puntos
- `POST /puntos/create-varios` - Crear múltiples puntos
- `PUT /puntos/{id}` - Actualizar punto

#### 🚨 **Reporte Emergencia Service**
- `POST /reporte-emergencia` - Crear reporte
- `GET /reporte-emergencia` - Listar reportes
- `PUT /reporte-emergencia/{id}` - Actualizar reporte
- `POST /reporte-emergencia/{id}/cerrar` - Cerrar reporte

#### 🏢 **Zonas Service**
- `GET /zonas` - Listar zonas
- `POST /zonas` - Crear zona
- `PUT /zonas/{id}` - Actualizar zona

### 🛠️ **Tecnologías**

- **Serverless Framework** - Infraestructura como código
- **AWS Lambda** - Funciones serverless
- **PostgreSQL** - Base de datos (RDS)
- **Node.js** - Runtime
- **Axios** - Cliente HTTP
- **Firebase Admin SDK** - Notificaciones push

### 🚀 **Despliegue**

```bash
# Instalar dependencias
cd api
npm install

# Desplegar a AWS
serverless deploy

# Desplegar servicio específico
serverless deploy -f saveUser
```

---

## 🖥️ **back/** - Backend Tradicional

### 🎯 **Descripción**
Backend tradicional con Node.js y Express para funcionalidades que requieren estado persistente o procesamiento continuo.

### ✨ **Funcionalidades**

- **Socket.io** - Comunicación en tiempo real
- **Notificaciones Push** - Sistema de alertas
- **Procesamiento de Archivos** - PDFs, imágenes
- **Integración con APIs** - Servicios externos

### 🛠️ **Tecnologías**

- **Node.js** - Runtime
- **Express.js** - Framework web
- **Socket.io** - WebSockets
- **Redis** - Cache y sesiones
- **PostgreSQL** - Base de datos

---

## 🗄️ **rds/** - Base de Datos

### 🎯 **Descripción**
Scripts SQL para PostgreSQL que definen la estructura de la base de datos y funciones almacenadas.

### 📊 **Tablas Principales**

- **users** - Usuarios del sistema
- **pedidos** - Pedidos de gas
- **vehiculos** - Flota de vehículos
- **puntos** - Puntos de entrega
- **zonas** - Zonas de distribución
- **reporte_emergencia** - Reportes de emergencia
- **frecuencias** - Frecuencias de entrega

### 🔧 **Funciones SQL**

- **save_puntos** - Crear múltiples puntos
- **update_user** - Actualizar usuario
- **asignar_conductor_pedido** - Asignar conductor

---

## 🔐 **Configuración de Seguridad**

### 🔑 **Variables de Entorno**

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Database
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### 📱 **Configuración Móvil**

- **Firebase**: Configurar `GoogleService-Info.plist` (iOS) y `google-services.json` (Android)
- **Push Notifications**: Configurar certificados APNs y FCM
- **Deep Linking**: Configurar URL schemes

---

## 🚀 **Despliegue**

### 📱 **Aplicación Móvil**

```bash
# Android
cd codegas-app/android
./gradlew assembleRelease

# iOS (requiere macOS)
cd codegas-app/ios
xcodebuild -workspace codegas.xcworkspace -scheme codegas -configuration Release
```

### 🔧 **Backend Serverless**

```bash
cd api
serverless deploy --stage production
```

### 🖥️ **Backend Tradicional**

```bash
cd back
npm install
npm start
```

---

## 📊 **Monitoreo y Analytics**

- **Firebase Analytics** - Métricas de uso móvil
- **AWS CloudWatch** - Logs y métricas serverless
- **Crashlytics** - Reportes de errores
- **Performance Monitoring** - Rendimiento de la app

---

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 📞 **Soporte**

Para soporte técnico o consultas:
- **Email**: soporte@codegas.com
- **Documentación**: [docs.codegas.com](https://docs.codegas.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/codegas/issues)

---

## 🏆 **Características Destacadas**

- ✅ **Multiplataforma**: iOS y Android
- ✅ **Escalable**: Arquitectura serverless
- ✅ **Tiempo Real**: WebSockets y push notifications
- ✅ **Seguro**: Autenticación Firebase y encriptación
- ✅ **Optimizado**: APK reducido con ProGuard
- ✅ **Moderno**: React Native 0.81 + TypeScript
