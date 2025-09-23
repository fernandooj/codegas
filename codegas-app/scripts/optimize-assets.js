#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para optimizar assets y reducir el tamaño del APK
 */

const ASSETS_DIR = path.join(__dirname, '../src/assets');

function optimizeAssets() {
    console.log('🔍 Analizando assets...');

    let totalSize = 0;
    let fileCount = 0;
    const largeFiles = [];

    function scanDirectory(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else {
                const size = stat.size;
                totalSize += size;
                fileCount++;

                // Archivos grandes (>500KB)
                if (size > 500 * 1024) {
                    largeFiles.push({
                        path: filePath.replace(process.cwd(), '.'),
                        size: (size / 1024 / 1024).toFixed(2) + ' MB'
                    });
                }
            }
        });
    }

    scanDirectory(ASSETS_DIR);

    console.log(`\n📊 Resumen de assets:`);
    console.log(`   Total de archivos: ${fileCount}`);
    console.log(`   Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    if (largeFiles.length > 0) {
        console.log(`\n⚠️  Archivos grandes encontrados:`);
        largeFiles.forEach(file => {
            console.log(`   ${file.path}: ${file.size}`);
        });
        console.log(`\n💡 Recomendaciones:`);
        console.log(`   - Comprimir imágenes grandes`);
        console.log(`   - Considerar usar WebP para imágenes`);
        console.log(`   - Mover assets pesados a CDN`);
    }
}

function generateOptimizedBundle() {
    console.log('\n🚀 Generando bundle optimizado...');

    const bundleCommand = 'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/';

    console.log(`Ejecutando: ${bundleCommand}`);
    return bundleCommand;
}

if (require.main === module) {
    optimizeAssets();
    console.log('\n📝 Para generar bundle optimizado, ejecuta:');
    console.log(generateOptimizedBundle());
}

module.exports = { optimizeAssets, generateOptimizedBundle };
