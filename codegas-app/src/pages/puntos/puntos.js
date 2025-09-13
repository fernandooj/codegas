import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
import axios from "axios"
import { style } from './style'
import { useSelector, useDispatch } from 'react-redux'
import Toast from 'react-native-toast-message';

import { getUsuarios } from '../../redux/actions/usuarioActions'
import Footer from '../components/footer'



const Puntos = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const usuarios = useSelector(state => state.usuario.usuarios || []);
    const usuariosFiltro = useSelector(state => state.usuario.usuarios || []);

    const [state, setState] = useState({
        terminoBuscador: "",
        puntos: [],
        idUsuario: ""
    });

    const updateState = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    useEffect(() => {
        const params = navigation?.state?.params || route?.params;
        const { idUsuario } = params || {};

        if (!idUsuario) {
            console.error("No se encontró idUsuario en los parámetros");
            return;
        }

        axios.get(`pun/punto/byCliente/${idUsuario}`)
            .then(response => {
                if (response.data.status) {
                    updateState({ puntos: response.data.puntos, idUsuario });
                } else {
                    Toast.show({ type: 'error', text1: "Tuvimos un problema, inténtelo más tarde" });
                }
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                Toast.show({ type: 'error', text1: "Error en la conexión, inténtelo más tarde" });
            });
    }, [navigation, route, updateState]);

    const renderPuntos = useCallback(() => {
        const { idUsuario, puntos } = state;

        return puntos.map((e, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity key={key} style={style.btnZona} onPress={() => navigation.navigate("revision", { direccion: e.direccion, capacidad: e.capacidad, observacion: e.observacion, puntoId: e._id, clienteId: idUsuario })}>
                        <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon} resizeMode={'contain'} />
                        <View>
                            <Text style={style.textZona}>{e.direccion}</Text>
                            <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                            {e.observacion && <Text style={style.textZona}>Observacion: {e.observacion == "" ? "&nbsp;" : e.observacion}</Text>}
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [state.idUsuario, state.puntos, navigation]);

    const { terminoBuscador } = state;

    return (
        <View style={style.container}>
            <Text style={style.titulo}>Listado Puntos</Text>
            <TextInput
                placeholder="Buscar por: cliente, fecha, forma"
                autoCapitalize='none'
                placeholderTextColor="#aaa"
                onChangeText={(terminoBuscador) => updateState({ terminoBuscador })}
                value={terminoBuscador}
                style={[style.inputCabezera]}
            />
            <ScrollView style={{ marginBottom: 85 }} keyboardDismissMode="on-drag">
                {renderPuntos()}
            </ScrollView>
            <Footer navigation={navigation} />
        </View>
    )
}
Puntos.defaultProps = {
    perfil: { categoria: [] }
}

export default Puntos 
