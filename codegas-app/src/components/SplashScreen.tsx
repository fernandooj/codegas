import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    Easing
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    // Valores animados
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const tankMoveAnim = useRef(new Animated.Value(-100)).current;
    const textSlideAnim = useRef(new Animated.Value(50)).current;
    const logoRotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Secuencia de animaciones
        const animationSequence = Animated.sequence([
            // 1. Fade in general
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // 2. Escalar logo y mover tanque simultáneamente
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(tankMoveAnim, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(textSlideAnim, {
                    toValue: 0,
                    duration: 600,
                    delay: 200,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                })
            ]),
            // 3. Rotación sutil del logo
            Animated.timing(logoRotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }),
            // 4. Pausa antes de terminar
            Animated.delay(800)
        ]);

        animationSequence.start(() => {
            // Callback cuando termine la animación
            if (onFinish) {
                onFinish();
            }
        });

        // Cleanup
        return () => {
            animationSequence.stop();
        };
    }, [fadeAnim, scaleAnim, tankMoveAnim, textSlideAnim, logoRotateAnim, onFinish]);

    // Interpolación para la rotación
    const logoRotation = logoRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Logo principal con animación */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [{ rotate: logoRotation }]
                        }
                    ]}
                >
                    <View style={styles.logoBackground}>
                        <FontAwesome name="truck" style={styles.logoIcon} />
                    </View>
                </Animated.View>

                {/* Tanque animado */}
                <Animated.View
                    style={[
                        styles.tankContainer,
                        {
                            transform: [{ translateX: tankMoveAnim }]
                        }
                    ]}
                >
                    <FontAwesome name="truck" style={styles.tankIcon} />
                    <View style={styles.tankTrail}>
                        <View style={[styles.dot, { opacity: 0.8 }]} />
                        <View style={[styles.dot, { opacity: 0.6 }]} />
                        <View style={[styles.dot, { opacity: 0.4 }]} />
                    </View>
                </Animated.View>

                {/* Texto principal */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            transform: [{ translateY: textSlideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.welcomeText}>Bienvenido a</Text>
                    <Text style={styles.brandText}>CODEGAS</Text>
                    <Text style={styles.subtitleText}>Tu plataforma de gestión de pedidos</Text>
                </Animated.View>

                {/* Indicador de carga */}
                <Animated.View
                    style={[
                        styles.loadingContainer,
                        {
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <View style={styles.loadingBar}>
                        <Animated.View
                            style={[
                                styles.loadingProgress,
                                {
                                    transform: [{ scaleX: scaleAnim }]
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.loadingText}>Cargando...</Text>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.8,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoBackground: {
        backgroundColor: '#007bff',
        borderRadius: 60,
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoIcon: {
        fontSize: 50,
        color: '#fff',
    },
    tankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        width: width * 0.6,
    },
    tankIcon: {
        fontSize: 30,
        color: '#28a745',
    },
    tankTrail: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#28a745',
        marginHorizontal: 2,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    welcomeText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '400',
        marginBottom: 8,
        textAlign: 'center',
    },
    brandText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 2,
    },
    subtitleText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        width: width * 0.6,
    },
    loadingBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#e9ecef',
        borderRadius: 2,
        marginBottom: 12,
        overflow: 'hidden',
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: '#007bff',
        borderRadius: 2,
        transformOrigin: 'left',
    },
    loadingText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
});

export default SplashScreen;
