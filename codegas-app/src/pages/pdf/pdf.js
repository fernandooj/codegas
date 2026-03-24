import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Pdf from 'react-native-pdf';

function resolvePdfUri(route, navigation) {
    const fromRoute = route?.params?.uri;
    if (fromRoute && typeof fromRoute === 'string') return fromRoute;
    try {
        const st = navigation?.getState?.();
        const r = st?.routes?.[st.index];
        const u = r?.params?.uri;
        if (u && typeof u === 'string') return u;
    } catch (e) { /* ignore */ }
    const legacy = navigation?.state?.params?.uri;
    return typeof legacy === 'string' ? legacy : null;
}

export default class PDFExample extends React.Component {
    render() {
        const { navigation, route } = this.props;
        const uri = resolvePdfUri(route, navigation);

        if (!uri) {
            return (
                <View style={[styles.container, styles.centered]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <FontAwesome name="arrow-left" style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.errorText}>No se recibió la dirección del PDF.</Text>
                </View>
            );
        }

        const source = {
            uri,
            cache: true,
            ...(Platform.OS === 'android' ? { trustAllCerts: true } : {}),
        };

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FontAwesome name="arrow-left" style={styles.icon} />
                </TouchableOpacity>
                <Pdf
                    source={source}
                    onLoadComplete={() => {}}
                    onPageChanged={() => {}}
                    onError={() => {
                        Alert.alert('PDF', 'No se pudo cargar el documento. Comprueba tu conexión o que el archivo siga disponible.');
                    }}
                    onPressLink={() => {}}
                    style={styles.pdf}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    centered: {
        justifyContent: 'center',
    },
    errorText: {
        paddingHorizontal: 24,
        textAlign: 'center',
        color: '#333',
        fontSize: 16,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 15,
        zIndex: 1,
    },
    icon: {
        fontSize: 24,
        color: 'black',
    },
});