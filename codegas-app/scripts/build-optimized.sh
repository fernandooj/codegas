#!/bin/bash

# Script para generar APK optimizado con tamaño reducido

echo "🚀 Iniciando build optimizado de Android..."

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
cd android
./gradlew clean
cd ..

# Analizar assets
echo "📊 Analizando assets..."
node scripts/optimize-assets.js

# Generar bundle optimizado
echo "📦 Generando bundle optimizado..."
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/ \
  --sourcemap-output android/app/src/main/assets/index.android.bundle.map

# Crear directorio assets si no existe
mkdir -p android/app/src/main/assets

# Generar APK release optimizado
echo "🔨 Generando APK release optimizado..."
cd android
./gradlew assembleRelease

echo "✅ Build completado!"
echo ""
echo "📁 APKs generados en:"
find app/build/outputs/apk -name "*.apk" -exec ls -lh {} \;

echo ""
echo "📊 Tamaños de APK:"
find app/build/outputs/apk -name "*.apk" -exec sh -c 'echo "$(basename "$1"): $(ls -lh "$1" | awk "{print \$5}")"' _ {} \;

cd ..
