import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput, Platform, Image, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import TomarFoto from "../components/tomarFoto";
import SubirDocumento from "../components/subirDocumento";
import { style } from './style';
import { sectores, ubicaciones, m3s, images } from '../../utils/constants';

interface UseRevisionStepsProps {
    state: any;
    updateState: (updates: any) => void;
    buscarTanque: (id: any) => void;
    alertaEliminarTanque: (placaText: any, codt: any, razon_social: any) => void;
    filtroClientes: (idCliente: any) => void;
    buscarCiudad: (ciudad: any) => void;
    buscarPoblado: (ciudad: any) => void;
    solicitudServicio: () => void;
    uploadImagen: (imagen: any, type: any, mime: any) => void;
    navigation: any;
    renderModalAlerta: () => React.ReactNode;
}

const useRevisionSteps = ({
    state,
    updateState,
    buscarTanque,
    alertaEliminarTanque,
    filtroClientes,
    buscarCiudad,
    buscarPoblado,
    solicitudServicio,
    uploadImagen,
    navigation,
    renderModalAlerta
}: UseRevisionStepsProps) => {

    const step1 = useCallback(() => {
        const { tanqueIdArray, tanqueArray, modalPlacas, placas, placaText, puntoId, usuarioId } = state;

        return (
            <View>
                {/* PLACAS */}
                <ModalFilterPicker
                    placeholderText="Placas ..."
                    visible={modalPlacas}
                    onSelect={(e: any) => buscarTanque(e)}
                    onCancel={() => updateState({ modalPlacas: false })}
                    crearTanque={(e: any) => {
                        navigation.navigate("nuevoTanque", { placaText: e, puntoId, usuarioId });
                        updateState({ modalPlacas: false })
                    }}
                    options={placas}
                    revision
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Placa</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalPlacas: true })}>
                        <Text style={placaText ? style.textBtnActive : style.textBtn}>{placaText ? placaText : "Placas"}</Text>
                    </TouchableOpacity>
                </View>

                {
                    tanqueArray.map((e: any, key: number) => {
                        return (
                            <View style={style.contenedorUsuario} key={key}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity style={{ width: "90%", alignItems: "center" }} onPress={() => navigation.navigate("nuevoTanque", { tanqueId: e._id })}>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Placa:</Text>
                                            <Text style={style.row2}>{e.placaText}</Text>
                                        </View>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Capacidad:</Text>
                                            <Text style={style.row2}>{e.capacidad}</Text>
                                        </View>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Propiedad:</Text>
                                            <Text style={style.row2}>{e.propiedad}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => e.usuarioId ? alertaEliminarTanque(e.placaText, e.usuarioId.codt, e.usuarioId.razon_social) : null}>
                                        <FontAwesome name="trash" style={style.iconTrash} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }, [state.tanqueIdArray, state.tanqueArray, state.modalPlacas, state.placas, state.placaText, state.puntoId, state.usuarioId, buscarTanque, alertaEliminarTanque, updateState, navigation]);

    const step2 = useCallback(() => {
        const { modalSectores, sector, barrio, usuariosAtendidos, modalM3, m3, usuarioId, modalCliente, clientes, codtCliente, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId, modalPropiedad, propiedad, nComodatoText, nMedidorText, ubicacion, modalUbicacion, capacidad, direccion, observacion } = state;

        return (
            <View>
                {/* SECTORES */}
                <ModalFilterPicker
                    placeholderText="Sectores ..."
                    visible={modalSectores}
                    onSelect={(e: any) => updateState({ sector: e.key, modalSectores: false })}
                    onCancel={() => updateState({ modalSectores: false })}
                    options={sectores}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Sector</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalSectores: true })}>
                        <Text style={sector ? style.textBtnActive : style.textBtn}>{sector ? sector : "Sector"}</Text>
                    </TouchableOpacity>
                </View>

                {/* BARRIO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Barrio</Text>
                    <TextInput
                        placeholder="Barrio"
                        value={barrio}
                        style={style.inputStep2}
                        onChangeText={(barrio: string) => updateState({ barrio })}
                    />
                </View>

                {/* USUARIOS ATENDIDOS */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Usuarios Atendidos</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Usuarios Atendidos"
                        style={style.inputStep2}
                        value={usuariosAtendidos}
                        onChangeText={(usuariosAtendidos: string) => updateState({ usuariosAtendidos })}
                    />
                </View>

                {/* M3 */}
                <ModalFilterPicker
                    placeholderText="M3 ..."
                    visible={modalM3}
                    onSelect={(e: any) => updateState({ m3: e.key, modalM3: false })}
                    onCancel={() => updateState({ modalM3: false })}
                    options={m3s}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>M3</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalM3: true })}>
                        <Text style={m3 ? style.textBtnActive : style.textBtn}>{m3 ? m3 : "M3"}</Text>
                    </TouchableOpacity>
                </View>

                {/* NO MEDIDOR TEXTO */}
                {
                    m3 == "Si"
                    && <View style={style.contenedorSetp2}>
                        <Text style={style.row1Step2}>N° Medidor</Text>
                        <TextInput
                            placeholder="N° Medidor"
                            value={nMedidorText}
                            style={style.inputStep2}
                            onChangeText={(nMedidorText: string) => updateState({ nMedidorText })}
                        />
                    </View>
                }

                {/* UBICACIONES */}
                <ModalFilterPicker
                    placeholderText="ubicaciones ..."
                    visible={modalUbicacion}
                    onSelect={(e: any) => updateState({ ubicacion: e.key, modalUbicacion: false })}
                    onCancel={() => updateState({ modalUbicacion: false })}
                    options={ubicaciones}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Ubicación</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalUbicacion: true })}>
                        <Text style={ubicacion ? style.textBtnActive : style.textBtn}>{ubicacion ? ubicacion : "Ubicación"}</Text>
                    </TouchableOpacity>
                </View>

                {/* NUMERO DE COMODATO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>N Comodato</Text>
                    <TextInput
                        placeholder="N Comodato"
                        value={nComodatoText}
                        style={style.inputStep2}
                        onChangeText={(nComodatoText: string) => updateState({ nComodatoText })}
                    />
                </View>

                {/* USUARIO */}
                <ModalFilterPicker
                    placeholderText="Filtrar ..."
                    visible={modalCliente}
                    onSelect={(e: any) => filtroClientes(e)}
                    onCancel={() => updateState({ modalCliente: false })}
                    options={clientes}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />

                {
                    usuarioId
                    && <View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Identificación:</Text>
                            <Text style={style.row2}>{cedulaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>CODT:</Text>
                            <Text style={style.row2}>{codtCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Razón Social:</Text>
                            <Text style={style.row2}>{razon_socialCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Dirección:</Text>
                            <Text style={style.row2}>{direccion_facturaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Nombre:</Text>
                            <Text style={style.row2}>{nombreCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Celular:</Text>
                            <Text style={style.row2}>{celularCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Email:</Text>
                            <Text style={style.row2}>{emailCliente}</Text>
                        </View>
                    </View>
                }
                <View style={style.btnZonaActiva} >
                    <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon} resizeMode={'contain'} />
                    <View>
                        <Text style={style.textZona}>{direccion}</Text>
                        <Text style={style.textZona}>Almacenamiento: {capacidad}</Text>
                        <Text style={style.textZona}>Observacion: {observacion}</Text>
                    </View>
                </View>
            </View>
        )
    }, [state.modalSectores, state.sector, state.barrio, state.usuariosAtendidos, state.modalM3, state.m3, state.usuarioId, state.modalCliente, state.clientes, state.codtCliente, state.cedulaCliente, state.razon_socialCliente, state.celularCliente, state.emailCliente, state.nombreCliente, state.direccion_facturaCliente, state.puntos, state.puntoId, state.modalPropiedad, state.propiedad, state.nComodatoText, state.nMedidorText, state.ubicacion, state.modalUbicacion, state.capacidad, state.direccion, state.observacion, updateState, filtroClientes]);

    const step3 = useCallback(() => {
        const { observaciones, avisos, extintores, distancias, electricas, accesorios, estado, solicitudServicio, imgAlerta, alertaText, alertaFecha, nActa, depTecnicoEstado, imgDepTecnico, depTecnicoText } = state;
        return (
            <View>
                {/* OBSERVACIONES */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Observaciones</Text>
                    <TextInput
                        placeholder="Observaciones"
                        style={style.inputStep4}
                        value={observaciones}
                        onChangeText={(observaciones: string) => updateState({ observaciones })}
                    />
                </View>
                <View style={style.separador}></View>
                {
                    estado == "2"
                        ? <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Solicitud</Text>
                            <Text style={style.row1Step2}>{solicitudServicio}</Text>
                        </View>
                        : estado == "3"
                            ? <>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Solicitud</Text>
                                    <Text style={style.row1Step2}>{solicitudServicio}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Comentario</Text>
                                    <Text style={style.row1Step2}>{alertaText}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Fecha</Text>
                                    <Text style={style.row1Step2}>{alertaFecha}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>N Acta</Text>
                                    <Text style={style.row1Step2}>{nActa}</Text>
                                </View>
                                <TomarFoto
                                    source={imgAlerta}
                                    width={180}
                                    titulo="Retiro de tanques"
                                    limiteImagenes={1}
                                    imagenes={(imgAlerta: any) => { updateState({ imgAlerta }) }}
                                />
                            </>
                            : <TouchableOpacity style={style.nuevaFrecuencia} onPress={() => updateState({ modalAlerta: true })}>
                                <Text style={style.textGuardar}>Nueva Alerta</Text>
                            </TouchableOpacity>
                }
                <View style={style.separador}></View>
                {
                    depTecnicoEstado
                        ? <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Observacion</Text>
                                <Text style={style.row1Step2}>{depTecnicoText}</Text>
                            </View>
                            <TomarFoto
                                source={imgDepTecnico}
                                width={180}
                                titulo="Retiro de tanques"
                                limiteImagenes={1}
                                imagenes={(imgDepTecnico: any) => { updateState({ imgDepTecnico }) }}
                            />
                        </>
                        : <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Falta de Avisos reglamentarios</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (avisos ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[avisos ? style.switchEnableBorder : style.switchDisableBorder]}
                                    value={avisos}
                                    onValueChange={(avisos: boolean) => updateState({ avisos })}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Falta extintores</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (extintores ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[extintores ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(extintores: boolean) => updateState({ extintores })}
                                    value={extintores}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>No cumple distancias</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (distancias ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[distancias ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(distancias: boolean) => updateState({ distancias })}
                                    value={distancias}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Fuentes ignición cerca</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (electricas ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[electricas ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(electricas: boolean) => updateState({ electricas })}
                                    value={electricas}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Cumple accesorios y materiales</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (accesorios ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[accesorios ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(accesorios: boolean) => updateState({ accesorios })}
                                    value={accesorios}
                                />
                            </View>
                        </>
                }
            </View>
        )
    }, [state.observaciones, state.avisos, state.extintores, state.distancias, state.electricas, state.accesorios, state.estado, state.solicitudServicio, state.imgAlerta, state.alertaText, state.alertaFecha, state.nActa, state.depTecnicoEstado, state.imgDepTecnico, state.depTecnicoText, updateState]);

    const step4 = useCallback(() => {
        return (
            <View>
                {
                    images.map(({ title, type, mime, source }: any) => {
                        if (mime === 'image/jpeg') {
                            return (
                                <React.Fragment key={title}>
                                    <TomarFoto
                                        source={(state as any)[source]}
                                        width={180}
                                        titulo={title}
                                        limiteImagenes={4}
                                        imagenes={(e: any) => { uploadImagen(e, type, mime) }}
                                    />
                                    <View style={style.separador}></View>
                                </React.Fragment>
                            )
                        } else {
                            return (
                                <React.Fragment key={title}>
                                    <SubirDocumento
                                        navigate={navigation.navigate}
                                        source={(state as any)[source]}
                                        width={180}
                                        titulo={title}
                                        limiteImagenes={4}
                                        imagenes={(e: any) => { uploadImagen(e, type, mime) }}
                                    />
                                    <View style={style.separador}></View>
                                </React.Fragment>
                            )
                        }
                    })
                }
            </View>
        )
    }, [state, navigation, uploadImagen]);

    const step5 = useCallback(() => {
        const { lat, lng, accesoPerfil, modalDpto, dpto, dptos, modalCiudad, ciudades, ciudad, modalPoblado, poblados, poblado } = state;
        return (
            <View>
                {
                    (accesoPerfil == "admin" || accesoPerfil == "adminTanque")
                        ? <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Latitud</Text>
                                <TextInput
                                    placeholder="Latitud"
                                    style={style.inputStep2}
                                    value={lat ? lat.toString() : ""}
                                    onChangeText={(lat: string) => updateState({ lat })}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Longitud</Text>
                                <TextInput
                                    placeholder="Longitud"
                                    style={style.inputStep2}
                                    value={lng ? lng.toString() : ""}
                                    onChangeText={(lng: string) => updateState({ lng })}
                                />
                            </View>
                        </>
                        : <><Text>Lat: {lat}</Text>
                            <Text>Lng: {lng}</Text></>
                }
                {/* DEPARTAMENTOS */}
                <ModalFilterPicker
                    placeholderText="Dpto ..."
                    visible={modalDpto}
                    onSelect={(e: any) => buscarCiudad(e.key)}
                    onCancel={() => updateState({ modalDpto: false })}
                    options={dptos}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Dpto</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalDpto: true })}>
                        <Text style={dpto ? style.textBtnActive : style.textBtn}>{dpto ? dpto : "Dpto"}</Text>
                    </TouchableOpacity>
                </View>

                {/* CIUDADES */}
                <ModalFilterPicker
                    placeholderText="ciudad ..."
                    visible={modalCiudad}
                    onSelect={(e: any) => buscarPoblado(e.key)}
                    onCancel={() => updateState({ modalCiudad: false })}
                    options={ciudades}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>ciudad</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalCiudad: true })}>
                        <Text style={ciudad ? style.textBtnActive : style.textBtn}>{ciudad ? ciudad : "ciudad"}</Text>
                    </TouchableOpacity>
                </View>

                {/* POBLADOS */}
                <ModalFilterPicker
                    placeholderText="Poblado ..."
                    visible={modalPoblado}
                    onSelect={(e: any) => updateState({ poblado: e.key, modalPoblado: false })}
                    onCancel={() => updateState({ modalPoblado: false })}
                    options={poblados}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Poblado</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalPoblado: true })}>
                        <Text style={poblado ? style.textBtnActive : style.textBtn}>{poblado ? poblado : "Poblado"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [state.lat, state.lng, state.accesoPerfil, state.modalDpto, state.dpto, state.dptos, state.modalCiudad, state.ciudades, state.ciudad, state.modalPoblado, state.poblados, state.poblado, buscarCiudad, buscarPoblado, updateState]);

    return {
        step1,
        step2,
        step3,
        step4,
        step5
    };
};

export default useRevisionSteps;
