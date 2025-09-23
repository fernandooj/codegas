#!/bin/bash

# Script para solucionar el problema de dSYM de Hermes en TestFlight
# Ejecutar este script después de hacer archive pero antes de subir a TestFlight

echo "🔧 Solucionando problema de dSYM de Hermes..."

# 1. Encontrar el archivo .xcarchive más reciente
ARCHIVE_PATH=$(find ~/Library/Developer/Xcode/Archives -name "*.xcarchive" -type d | sort | tail -1)

if [ -z "$ARCHIVE_PATH" ]; then
    echo "❌ No se encontró ningún archivo .xcarchive"
    echo "   Asegúrate de haber hecho archive primero"
    exit 1
fi

echo "📦 Archivo encontrado: $ARCHIVE_PATH"

# 2. Crear directorio dSYMs si no existe
DSYMS_PATH="$ARCHIVE_PATH/dSYMs"
mkdir -p "$DSYMS_PATH"

# 3. Buscar el framework de Hermes en el proyecto
HERMES_FRAMEWORK_PATH=$(find . -name "hermes.framework" -type d | head -1)

if [ -z "$HERMES_FRAMEWORK_PATH" ]; then
    echo "❌ No se encontró hermes.framework"
    echo "   Verificando en Pods..."
    HERMES_FRAMEWORK_PATH=$(find ./Pods -name "hermes.framework" -type d | head -1)
fi

if [ -z "$HERMES_FRAMEWORK_PATH" ]; then
    echo "❌ No se encontró hermes.framework en Pods"
    echo "   Intentando descargar desde hermes-engine..."
    
    # 4. Descargar dSYM de Hermes desde la versión oficial
    HERMES_VERSION="0.81.1"
    HERMES_DSYM_URL="https://repo1.maven.org/maven2/com/facebook/react/react-native-artifacts/${HERMES_VERSION}/react-native-artifacts-${HERMES_VERSION}-hermes-ios-release.tar.gz"
    
    echo "📥 Descargando dSYM de Hermes versión $HERMES_VERSION..."
    curl -L "$HERMES_DSYM_URL" -o hermes-release.tar.gz
    
    if [ $? -eq 0 ]; then
        echo "✅ Descarga exitosa"
        tar -xzf hermes-release.tar.gz
        rm hermes-release.tar.gz
        
        # Buscar el dSYM en el archivo extraído
        HERMES_DSYM_PATH=$(find . -name "hermes.framework.dSYM" -type d | head -1)
        
        if [ -n "$HERMES_DSYM_PATH" ]; then
            echo "📋 Copiando dSYM de Hermes al archive..."
            cp -R "$HERMES_DSYM_PATH" "$DSYMS_PATH/"
            echo "✅ dSYM de Hermes copiado exitosamente"
        else
            echo "❌ No se pudo encontrar el dSYM en el archivo descargado"
        fi
    else
        echo "❌ Error al descargar el dSYM de Hermes"
    fi
else
    echo "✅ Framework de Hermes encontrado en: $HERMES_FRAMEWORK_PATH"
    
    # 5. Verificar si ya existe un dSYM para Hermes
    HERMES_BINARY="$HERMES_FRAMEWORK_PATH/hermes"
    if [ -f "$HERMES_BINARY" ]; then
        echo "🔍 Generando dSYM para hermes.framework..."
        
        # Crear dSYM usando dsymutil
        DSYM_OUTPUT="$DSYMS_PATH/hermes.framework.dSYM"
        dsymutil "$HERMES_BINARY" -o "$DSYM_OUTPUT"
        
        if [ $? -eq 0 ]; then
            echo "✅ dSYM generado exitosamente"
        else
            echo "❌ Error al generar dSYM"
        fi
    else
        echo "❌ No se encontró el binario de hermes"
    fi
fi

echo "🎉 Proceso completado!"
echo "📝 Ahora puedes subir el archive a TestFlight"
echo "💡 Si el problema persiste, intenta:"
echo "   1. Deshabilitar Hermes temporalmente (USE_HERMES = false)"
echo "   2. Hacer un nuevo archive"
echo "   3. Subir a TestFlight"
echo "   4. Habilitar Hermes nuevamente"
