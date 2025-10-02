import React, { useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { style } from './style';
import ModalZonas from './ModalZonas';

interface Ubicacion {
    direccion?: string;
    nombre?: string;
    email?: string;
    celular?: string;
    idZona?: string;
    nombreZona?: string;
    capacidad?: string;
    lat?: string;
    lng?: string;
    observacion?: string;
    activo: boolean;
    nuevo?: boolean;
    acceso: string;
    _id?: string;
}

interface Zona {
    _id: string;
    nombre: string;
}

interface ModalUbicacionProps {
    visible: boolean;
    ubicaciones: Ubicacion[];
    modalZona: boolean;
    zonas: Zona[];
    idZona: string;
    terminoBuscador: string;
    activeScroll: boolean;
    selectedUbicacionKey: number;
    onClose: () => void;
    onSave: () => void;
    onAddUbicacion: () => void;
    onDeleteUbicacion: (key: number) => void;
    onUpdateUbicacion: (type: string, value: string, key: number) => void;
    onOpenZonas: (key: number) => void;
    onCloseZonas: () => void;
    onSelectZona: (id: string, nombre: string) => void;
    onUpdateTermino: (termino: string) => void;
    onUpdateActiveScroll: (active: boolean) => void;
}

const ModalUbicacion: React.FC<ModalUbicacionProps> = ({
    visible,
    ubicaciones,
    modalZona,
    zonas,
    idZona,
    terminoBuscador,
    activeScroll,
    selectedUbicacionKey,
    onClose,
    onSave,
    onAddUbicacion,
    onDeleteUbicacion,
    onUpdateUbicacion,
    onOpenZonas,
    onCloseZonas,
    onSelectZona,
    onUpdateTermino,
    onUpdateActiveScroll
}) => {
    if (!visible) return null;

    return (
        <View style={style.modalUbicacionOverlay}>
            {modalZona && (
                <ModalZonas
                    visible={modalZona}
                    zonas={zonas}
                    idZona={ubicaciones[selectedUbicacionKey]?.idZona || ''}
                    terminoBuscador={terminoBuscador}
                    onClose={onCloseZonas}
                    onSelectZona={onSelectZona}
                    onUpdateTermino={onUpdateTermino}
                />
            )}

            <View style={style.modalUbicacionContainer}>
                {/* Header del Modal */}
                <View style={style.modalUbicacionHeader}>
                    <Text style={style.modalUbicacionTitle}>
                        Ubicaciones de Entrega
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={style.modalUbicacionCloseButton}
                    >
                        <FontAwesome name="times" size={16} style={style.modalUbicacionCloseIcon} />
                    </TouchableOpacity>
                </View>

                {/* Contenido del Modal */}
                <ScrollView
                    style={style.modalUbicacionScrollView}
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                >
                    <View style={style.modalContentPadding}>
                        <Text style={style.modalUbicacionDescription}>
                            Si el pedido lo realizará el encargado del punto por favor inserta su información, de lo contrario solo inserta la dirección y zona
                        </Text>

                        {ubicaciones.map((ubicacion, key) => (
                            <View key={key} style={style.ubicacionCard}>
                                <View style={style.ubicacionHeader}>
                                    <Text style={style.ubicacionTitle}>
                                        Ubicación {key + 1}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => onDeleteUbicacion(key)}
                                        style={style.ubicacionDeleteButton}
                                    >
                                        <FontAwesome name="trash" size={12} style={style.ubicacionDeleteIcon} />
                                    </TouchableOpacity>
                                </View>

                                {/* Campos de la ubicación */}
                                <View style={style.ubicacionFieldContainer}>
                                    <Text style={style.ubicacionFieldLabel}>
                                        Dirección *
                                    </Text>
                                    <TextInput
                                        placeholder="Dirección"
                                        value={ubicacion.direccion ? ubicacion.direccion.toUpperCase() : ubicacion.direccion}
                                        onChangeText={direccion => onUpdateUbicacion("direccion", direccion, key)}
                                        style={style.ubicacionFieldInput}
                                    />
                                </View>

                                <View style={style.ubicacionFieldContainer}>
                                    <Text style={style.ubicacionFieldLabel}>
                                        Zona *
                                    </Text>
                                    <TouchableOpacity
                                        style={style.ubicacionSelector}
                                        onPress={() => onOpenZonas(key)}
                                    >
                                        <Text style={style.ubicacionSelectorText}>
                                            {ubicacion.nombreZona || "Seleccionar zona"}
                                        </Text>
                                        <FontAwesome name="chevron-down" size={14} style={style.ubicacionSelectorIcon} />
                                    </TouchableOpacity>
                                </View>

                                {/* Campos de Coordenadas (Latitud y Longitud) */}
                                <View style={style.latLngContainer}>
                                    <View style={style.latLngFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Latitud
                                        </Text>
                                        <TextInput
                                            placeholder="Ej: 4.6230545"
                                            value={ubicacion.lat || ''}
                                            onChangeText={lat => onUpdateUbicacion("lat", lat, key)}
                                            style={style.ubicacionFieldInput}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={style.latLngFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Longitud
                                        </Text>
                                        <TextInput
                                            placeholder="Ej: -74.1910443"
                                            value={ubicacion.lng || ''}
                                            onChangeText={lng => onUpdateUbicacion("lng", lng, key)}
                                            style={style.ubicacionFieldInput}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={style.ubicacionFieldContainer}>
                                    <Text style={style.ubicacionFieldLabel}>
                                        Capacidad almacenamiento
                                    </Text>
                                    <TextInput
                                        placeholder="Capacidad almacenamiento"
                                        value={ubicacion.capacidad}
                                        onChangeText={capacidad => onUpdateUbicacion("capacidad", capacidad, key)}
                                        style={style.ubicacionFieldInput}
                                    />
                                </View>

                                <View style={style.ubicacionFieldContainer}>
                                    <Text style={style.ubicacionFieldLabel}>
                                        Observaciones
                                    </Text>
                                    <TextInput
                                        placeholder="Observaciones ingreso del vehículo"
                                        value={ubicacion.observacion || ''}
                                        onChangeText={observacion => onUpdateUbicacion("observacion", observacion, key)}
                                        style={style.ubicacionFieldInput}
                                    />
                                </View>

                                {/* Campo de Estado Activo */}
                                <View style={style.ubicacionFieldContainer}>
                                    <Text style={style.ubicacionFieldLabel}>
                                        Estado del punto
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            style.ubicacionSelector,
                                            ubicacion.activo === false && { borderColor: '#dc3545' }
                                        ]}
                                        onPress={() => onUpdateUbicacion("activo", ubicacion.activo === false ? "true" : "false", key)}
                                    >
                                        <Text style={[
                                            style.ubicacionSelectorText,
                                            { color: ubicacion.activo === false ? '#dc3545' : '#28a745' }
                                        ]}>
                                            {ubicacion.activo === false ? "Inactivo" : "Activo"}
                                        </Text>
                                        <FontAwesome
                                            name={ubicacion.activo === false ? "times-circle" : "check-circle"}
                                            size={14}
                                            style={[
                                                style.ubicacionSelectorIcon,
                                                { color: ubicacion.activo === false ? '#dc3545' : '#28a745' }
                                            ]}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {(ubicacion.nuevo || ubicacion._id) && (
                                    <>
                                        <View style={style.ubicacionFieldContainer}>
                                            <Text style={style.ubicacionFieldLabel}>
                                                Email
                                            </Text>
                                            <TextInput
                                                placeholder="Email"
                                                value={ubicacion.email}
                                                onFocus={() => onUpdateActiveScroll(true)}
                                                onBlur={() => onUpdateActiveScroll(false)}
                                                onChangeText={emailUbicacion => onUpdateUbicacion("emailUbicacion", emailUbicacion, key)}
                                                style={style.ubicacionFieldInput}
                                            />
                                        </View>

                                        <View style={style.ubicacionFieldContainer}>
                                            <Text style={style.ubicacionFieldLabel}>
                                                Celular
                                            </Text>
                                            <TextInput
                                                placeholder="Celular"
                                                value={ubicacion.celular}
                                                onFocus={() => onUpdateActiveScroll(true)}
                                                onBlur={() => onUpdateActiveScroll(false)}
                                                onChangeText={celularUbicacion => onUpdateUbicacion("celularUbicacion", celularUbicacion, key)}
                                                style={style.ubicacionFieldInput}
                                            />
                                        </View>

                                        <View style={style.ubicacionFieldContainer}>
                                            <Text style={style.ubicacionFieldLabel}>
                                                Nombre
                                            </Text>
                                            <TextInput
                                                placeholder="Nombre"
                                                value={ubicacion.nombre}
                                                onFocus={() => onUpdateActiveScroll(true)}
                                                onBlur={() => onUpdateActiveScroll(false)}
                                                onChangeText={nombreUbicacion => onUpdateUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                style={style.ubicacionFieldInput}
                                            />
                                        </View>
                                    </>
                                )}
                            </View>
                        ))}

                        {/* Botón Agregar Ubicación */}
                        <TouchableOpacity
                            onPress={onAddUbicacion}
                            style={style.addUbicacionButton}
                        >
                            <FontAwesome name="plus" size={16} color="#fff" style={style.addUbicacionIcon} />
                            <Text style={style.addUbicacionText}>
                                Agregar Ubicación
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer del Modal */}
                <View style={[style.modalFooter, style.modalFooterRow]}>
                    <TouchableOpacity
                        style={style.modalCancelButton}
                        onPress={onClose}
                    >
                        <Text style={style.modalButtonText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.modalSaveButton}
                        onPress={onSave}
                    >
                        <Text style={style.modalButtonText}>
                            Guardar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ModalUbicacion;
