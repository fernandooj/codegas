import React, { useState, useEffect } from 'react';
import { View, Image, Text, Dimensions, Platform, StyleSheet } from 'react-native';

const HeaderLogo = ({ 
  style, 
  showWelcome = false, 
  welcomeText = '', 
  subtitle = '',
  logoSource = require('../assets/img/pg1/fondo1.jpg'),
  containerStyle = {},
  variant = 'default' // 'default', 'compact', 'large'
}) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = screenData;

  // Calcular dimensiones responsivas basadas en el tamaño de pantalla y variante
  const getLogoDimensions = () => {
    const baseWidth = screenWidth * 0.7;
    const baseHeight = 90;
    
    // Ajustes por variante
    let widthMultiplier = 0.7;
    let heightMultiplier = 1;
    let marginTop = 10;

    switch (variant) {
      case 'compact':
        widthMultiplier = 0.6;
        heightMultiplier = 0.8;
        marginTop = 5;
        break;
      case 'large':
        widthMultiplier = 0.8;
        heightMultiplier = 1.2;
        marginTop = 15;
        break;
      default:
        // Configuración por defecto
        break;
    }

    // Ajustes por tamaño de pantalla
    if (screenWidth < 360) {
      // Pantallas muy pequeñas
      widthMultiplier = Math.min(widthMultiplier + 0.1, 0.85);
      heightMultiplier *= 0.9;
      marginTop = Math.max(marginTop - 5, 0);
    } else if (screenWidth > 414) {
      // Pantallas grandes
      widthMultiplier = Math.max(widthMultiplier - 0.05, 0.6);
      heightMultiplier *= 1.1;
      marginTop += 5;
    }

    // Ajustes por orientación
    if (screenWidth > screenHeight) {
      // Modo landscape
      widthMultiplier *= 0.8;
      heightMultiplier *= 0.7;
    }

    return {
      width: screenWidth * widthMultiplier,
      height: baseHeight * heightMultiplier,
      marginTop: marginTop
    };
  };

  const logoDimensions = getLogoDimensions();

  return (
    <View style={[styles.container, containerStyle]}>
      <Image 
        source={logoSource} 
        style={[
          styles.logo,
          {
            width: logoDimensions.width,
            height: logoDimensions.height,
            marginTop: logoDimensions.marginTop
          },
          style
        ]}
        resizeMode="contain"
        onError={(error) => {
          console.warn('Error loading logo:', error);
        }}
      />
      {showWelcome && (
        <View style={styles.welcomeContainer}>
          {welcomeText ? (
            <Text style={[styles.welcomeText, { fontSize: screenWidth < 360 ? 16 : 18 }]}>
              {welcomeText}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={[styles.subtitleText, { fontSize: screenWidth < 360 ? 12 : 14 }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    // Sombra sutil para mejor apariencia
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logo: {
    alignSelf: 'center',
    // Asegurar que el logo mantenga su proporción
    aspectRatio: 2.5, // Ajustar según la proporción real del logo
    maxWidth: '100%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002587',
    textAlign: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
});

export default HeaderLogo;
