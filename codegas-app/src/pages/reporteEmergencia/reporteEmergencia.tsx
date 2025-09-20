import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, ActivityIndicator, Dimensions, Modal } from 'react-native'
import { style } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getReportesEmergencia, searchReportesEmergencia } from '../../redux/actions/reporteActions'
import Footer from '../components/footer'
import { DataContext } from "../../context/context"
import { ReporteEmergenciaProps, ReporteEmergenciaItem, ReduxState } from './reporteEmergencia.types'

const ReporteEmergencia: React.FC<ReporteEmergenciaProps> = ({ navigation }) => {
    const { acceso, userId } = useContext(DataContext) as any;
    const dispatch = useDispatch() as any;

    const { reportes, loading, error } = useSelector((state: any) => state.reporte);
    const [searchTerm, setSearchTerm] = useState('');
    const [start] = useState(0);
    const [limit] = useState(100);
    const [showSortModal, setShowSortModal] = useState(false);

    useEffect(() => {

        dispatch(getReportesEmergencia(start, limit, 'all'));
    }, [dispatch, start, limit]);

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        dispatch(searchReportesEmergencia(text));
        dispatch(getReportesEmergencia(start, limit, text));
    };

    const onScroll = (e: any) => {
        // Implementar paginación si es necesario
    };

    const getReporteStatusColor = (reporte: ReporteEmergenciaItem) => {
        if (!reporte.activo) return '#dc3545'; // Rojo para inactivo
        if (reporte.estado === 3 || reporte.usuariocierra) return '#28a745'; // Verde para cerrado
        if (reporte.tanque || reporte.red || reporte.puntos || reporte.fuga) return '#ffc107'; // Amarillo para emergencia
        return '#17a2b8'; // Azul para normal
    };

    const getReporteStatusText = (reporte: ReporteEmergenciaItem) => {
        if (!reporte.activo) return 'Inactivo';
        if (reporte.estado === 3 || reporte.usuariocierra) return 'Cerrado';
        if (reporte.tanque || reporte.red || reporte.puntos || reporte.fuga) return 'Emergencia';
        return 'Activo';
    };

    const renderReportes = () => {
        if (reportes.length === 0) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 50,
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#999',
                        textAlign: 'center'
                    }}>
                        No hay reportes disponibles
                    </Text>
                </View>
            );
        }

        return reportes.map((reporte: ReporteEmergenciaItem, key: number) => {
            const statusColor = getReporteStatusColor(reporte);
            const statusText = getReporteStatusText(reporte);

            return (
                <View key={key} style={{
                    marginHorizontal: 16,
                    marginVertical: 8,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: statusColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                    width: Dimensions.get('window').width - 32,
                }}>
                    <TouchableOpacity
                        style={{ padding: 20 }}
                        onPress={() => navigation.navigate((acceso === "depTecnico" || acceso === "admin") ? "nuevoReporteEmergencia" : "", { reporteId: reporte._id })}
                        activeOpacity={0.8}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 6
                                }}>
                                    #{reporte._id}
                                </Text>

                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    marginBottom: 12
                                }}>
                                    {reporte.creado}
                                </Text>

                                {/* Status badge */}
                                <View style={{
                                    alignSelf: 'flex-start',
                                    backgroundColor: statusColor,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 16,
                                    marginBottom: 12,
                                }}>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: '600'
                                    }}>
                                        {statusText}
                                    </Text>
                                </View>

                                {/* Problemas como chips simples */}
                                {(reporte.tanque || reporte.red || reporte.puntos || reporte.fuga || reporte.pqr) && (
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {reporte.tanque && (
                                            <View style={{ backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#f57c00', fontWeight: '500' }}>Tanque</Text>
                                            </View>
                                        )}
                                        {reporte.red && (
                                            <View style={{ backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#f57c00', fontWeight: '500' }}>Red</Text>
                                            </View>
                                        )}
                                        {reporte.puntos && (
                                            <View style={{ backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#f57c00', fontWeight: '500' }}>Puntos</Text>
                                            </View>
                                        )}
                                        {reporte.fuga && (
                                            <View style={{ backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#f57c00', fontWeight: '500' }}>Fuga</Text>
                                            </View>
                                        )}
                                        {reporte.pqr && (
                                            <View style={{ backgroundColor: '#e8f5e8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#2e7d32', fontWeight: '500' }}>PQR</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Estado de solicitud */}
                                {reporte.estado === 2 && (
                                    <Text style={{ fontSize: 13, color: '#1976d2', marginTop: 8, fontStyle: 'italic' }}>
                                        Solicitud: {reporte.solicitudServicio}
                                    </Text>
                                )}
                                {reporte.estado === 3 && (
                                    <Text style={{ fontSize: 13, color: '#388e3c', marginTop: 8, fontWeight: '600' }}>
                                        Solicitud cerrada
                                    </Text>
                                )}
                            </View>

                            <FontAwesome name="chevron-right" size={16} color="#ccc" />
                        </View>
                    </TouchableOpacity>

                    {/* Documentos adjuntos */}
                    {reporte.documento.length > 0 && (
                        <View style={{
                            borderTopWidth: 1,
                            borderTopColor: '#f0f0f0',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            backgroundColor: '#fafafa'
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                marginBottom: 8,
                                fontWeight: '500'
                            }}>
                                Documentos:
                            </Text>
                            {reporte.documento.map((doc: string, docKey: number) => {
                                const document = doc.split("--");
                                return (
                                    <TouchableOpacity
                                        key={docKey}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 6,
                                        }}
                                        onPress={() => Linking.openURL(doc.toString()).catch(err => console.error("Couldn't load page", err))}
                                        activeOpacity={0.7}
                                    >
                                        <FontAwesome name="file-pdf-o" size={14} color="#d32f2f" />
                                        <Text style={{
                                            marginLeft: 8,
                                            fontSize: 13,
                                            color: '#1976d2',
                                            flex: 1
                                        }}>
                                            {document[1] || 'Documento'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            );
        });
    };

    const renderCabezera = () => {
        return (
            <View style={{
                width: "90%",
                marginTop: 15,
                alignSelf: 'center'
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 22,
                        marginVertical: 10,
                        color: '#333'
                    }}>
                        Reportes: {reportes.length}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {/* Botón de ordenamiento */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#28a745',
                                borderRadius: 8,
                                width: 36,
                                height: 36,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => setShowSortModal(true)}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name='sort' style={{
                                fontSize: 14,
                                color: '#fff'
                            }} />
                        </TouchableOpacity>

                        {/* Botón de actualizar */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007bff',
                                borderRadius: 8,
                                width: 36,
                                height: 36,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => dispatch(getReportesEmergencia(start, limit, searchTerm || 'all'))}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name='refresh' style={{
                                fontSize: 14,
                                color: '#fff'
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <TextInput
                            placeholder="Buscar por: ID, fecha, estado..."
                            placeholderTextColor="#aaa"
                            autoCapitalize='none'
                            onChangeText={handleSearch}
                            value={searchTerm}
                            style={{
                                fontFamily: "Comfortaa-Bold",
                                position: "relative",
                                zIndex: 0,
                                width: "93%",
                                shadowColor: 'rgba(0,0,0, .4)',
                                borderColor: "rgba(150,150,150, .5)",
                                shadowOffset: { height: 2, width: 2 },
                                shadowOpacity: .5,
                                shadowRadius: 5,
                                backgroundColor: '#fff',
                                paddingLeft: 10,
                                marginBottom: 20,
                                borderTopLeftRadius: 7,
                                borderBottomLeftRadius: 7,
                                paddingTop: 2,
                                borderWidth: 1,
                                height: 35
                            }}
                        />
                        <TouchableOpacity style={{
                            backgroundColor: "#002587",
                            alignItems: "center",
                            width: 30,
                            height: 35,
                            top: -1,
                            borderTopRightRadius: 7,
                            borderBottomRightRadius: 7,
                            paddingVertical: 9
                        }}>
                            <FontAwesome name='search' style={{
                                color: "#ffffff",
                                fontSize: 15
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={style.containerTanque}>
            {renderCabezera()}

            {/* Estados de carga y error */}
            {loading && (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 50,
                }}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={{
                        marginTop: 16,
                        fontSize: 16,
                        color: '#666'
                    }}>
                        Cargando reportes...
                    </Text>
                </View>
            )}

            {error && (
                <View style={{
                    backgroundColor: '#ffebee',
                    margin: 20,
                    padding: 16,
                    borderRadius: 8,
                }}>
                    <Text style={{
                        color: '#c62828',
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        Error: {error}
                    </Text>
                </View>
            )}

            {/* Lista de reportes */}
            {!loading && !error && (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    onScroll={onScroll}
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                >
                    {renderReportes()}
                </ScrollView>
            )}

            {/* Modal de ordenamiento */}
            <Modal
                visible={showSortModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSortModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        width: '80%',
                        maxWidth: 300
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 20,
                            textAlign: 'center',
                            color: '#333'
                        }}>
                            Ordenar Reportes
                        </Text>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#f8f9fa',
                                padding: 15,
                                borderRadius: 8,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: '#e9ecef'
                            }}
                            onPress={() => {
                                // Implementar ordenamiento por fecha
                                setShowSortModal(false);
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                Por Fecha (Más recientes)
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#f8f9fa',
                                padding: 15,
                                borderRadius: 8,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: '#e9ecef'
                            }}
                            onPress={() => {
                                // Implementar ordenamiento por estado
                                setShowSortModal(false);
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                Por Estado
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#f8f9fa',
                                padding: 15,
                                borderRadius: 8,
                                marginBottom: 20,
                                borderWidth: 1,
                                borderColor: '#e9ecef'
                            }}
                            onPress={() => {
                                // Implementar ordenamiento por ID
                                setShowSortModal(false);
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                Por ID
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#dc3545',
                                padding: 15,
                                borderRadius: 8
                            }}
                            onPress={() => setShowSortModal(false)}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: '600'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Footer navigation={navigation} />
        </View>
    );
};

export default ReporteEmergencia; 
