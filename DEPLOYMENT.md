# 🚀 Configuración de CI/CD para Codegas

Este proyecto está configurado con **GitHub Actions + Fastlane** para builds automáticos de iOS y Android.

## 📋 Prerequisitos

### Para iOS:
- [ ] Cuenta de Apple Developer
- [ ] App Store Connect configurado
- [ ] Certificados de desarrollo y distribución

### Para Android:
- [ ] Cuenta de Google Play Console
- [ ] Keystore de firma configurado

## 🔧 Configuración de Secrets en GitHub

Ve a tu repositorio → Settings → Secrets and variables → Actions

### Secrets para iOS:
```
APPLE_ID=tu-apple-id@example.com
APPLE_PASSWORD=tu-apple-password
APPLE_APP_SPECIFIC_PASSWORD=tu-app-specific-password
MATCH_PASSWORD=password-para-match
```

### Secrets para Android:
```
ANDROID_KEYSTORE_PASSWORD=tu-keystore-password
ANDROID_KEY_ALIAS=tu-key-alias
ANDROID_KEY_PASSWORD=tu-key-password
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=tu-service-account-json
```

## 📱 Cómo funciona

### Builds Automáticos:
- **Push a `main`**: Build + Deploy a TestFlight/Play Store
- **Push a `develop`**: Solo build
- **Pull Request**: Solo build para testing

### Comandos Locales:
```bash
# Build iOS
fastlane ios build

# Deploy a TestFlight
fastlane ios beta

# Build Android
fastlane android build

# Deploy a Google Play
fastlane android release
```

## 🛠 Configuración Inicial

### 1. Configurar Match (iOS):
```bash
# Crear repositorio para certificados
# Actualizar fastlane/Matchfile con tu repositorio

# Generar certificados
fastlane match appstore
```

### 2. Configurar Android:
- Subir keystore a tu repositorio
- Configurar service account de Google Play

## 📊 Monitoreo

Los builds aparecerán en:
- **GitHub Actions**: Ver progreso de builds
- **TestFlight**: Versiones iOS
- **Google Play Console**: Versiones Android

## 🔄 Flujo de Trabajo

1. **Desarrollo**: Trabaja en tu branch
2. **Push**: Sube cambios a `develop` o `main`
3. **Build**: GitHub Actions ejecuta automáticamente
4. **Deploy**: Si es `main`, se sube a las stores

## ⚠️ Notas Importantes

- Los builds en `main` se suben automáticamente a las stores
- Los builds en `develop` solo se compilan
- Los pull requests ejecutan builds de prueba
- Los certificados se manejan con Match para iOS
