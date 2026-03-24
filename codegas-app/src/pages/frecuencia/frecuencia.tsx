import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AppDispatch } from '../../redux/types';

import { style } from './style';
import { getFrecuencia } from '../../redux/actions/pedidoActions';
import { GET_PEDIDOS_FRECUENCIA } from '../../redux/actions/constants/actionsTypes';
import Footer from '../components/footer';
import { FrecuenciaState, PedidoFrecuencia, GrupoFrecuencia } from './types';
import EditarFrecuenciaModal from './EditarFrecuenciaModal';
import CrearGrupoFrecuenciaModal from './CrearGrupoFrecuenciaModal';
import EditarGrupoFrecuenciaModal from './EditarGrupoFrecuenciaModal';
import VerPedidosGrupoModal from './VerPedidosGrupoModal';

function pedidoFrecuenciaMatchesBusqueda(pedido: PedidoFrecuencia, termino: string): boolean {
    const busqueda = termino.trim().toLowerCase();
    if (!busqueda) return true;
    return (
        String(pedido.nombre || '').toLowerCase().includes(busqueda) ||
        String(pedido.codt || '').toLowerCase().includes(busqueda) ||
        String(pedido.pedido_id || '').toLowerCase().includes(busqueda) ||
        String(pedido.forma || '').toLowerCase().includes(busqueda) ||
        String(pedido.frecuencia || '').toLowerCase().includes(busqueda) ||
        String(pedido.razon_social || '').toLowerCase().includes(busqueda) ||
        String(pedido.dia1 || '').toLowerCase().includes(busqueda) ||
        String(pedido.dia2 || '').toLowerCase().includes(busqueda) ||
        String(pedido.punto_direccion || '').toLowerCase().includes(busqueda) ||
        String(pedido.punto_nombre || '').toLowerCase().includes(busqueda) ||
        String(pedido.zona_nombre || '').toLowerCase().includes(busqueda)
    );
}

function isQuincenalCalendarioIndividual(d1?: string | number, d2?: string | number): boolean {
    const a = parseInt(String(d1 ?? ''), 10);
    const b = parseInt(String(d2 ?? ''), 10);
    return Number.isFinite(a) && Number.isFinite(b) && a >= 1 && a <= 15 && b >= 16 && b <= 31;
}

/** 1=Lun … 7=Dom, coherente con getDay() de Date en hora local (Domingo JS=0 → 7) */
function fechaCoincideDiaSemana(d: Date, diaSemana1a7: number): boolean {
    const j = d.getDay();
    const our = j === 0 ? 7 : j;
    return our === diaSemana1a7;
}

const Frecuencia: React.FC = ({ navigation }: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const pedidos = useSelector((state: any) => state.pedido.pedidosFrecuencia);
    const grupos = useSelector((state: any) => state.pedido.gruposFrecuencia || []);

    const [isLoadingData, setIsLoadingData] = useState(true);

    const [state, setState] = useState<FrecuenciaState>({
        terminoBuscador: "",
        pedidos: [],
        pedidosFiltrados: [],
        inicio: 0,
        final: 10,
        showSpin: false,
        loading: false,
        showEditModal: false,
        editingFrecuencia: null,
        initialLoading: true
    });

    const [showCreateGrupoModal, setShowCreateGrupoModal] = useState(false);
    const [showEditGrupoModal, setShowEditGrupoModal] = useState(false);
    const [showVerPedidosModal, setShowVerPedidosModal] = useState(false);
    const [editingGrupo, setEditingGrupo] = useState<GrupoFrecuencia | null>(null);
    const [viewingGrupo, setViewingGrupo] = useState<GrupoFrecuencia | null>(null);
    const [activeTab, setActiveTab] = useState<'individuales' | 'grupos'>('individuales');
    const [gruposFiltrados, setGruposFiltrados] = useState<GrupoFrecuencia[]>([]);

    useEffect(() => {
        const loadFrecuencias = async () => {
            try {
                setIsLoadingData(true);
                // Limpiar datos anteriores de Redux
                dispatch({
                    type: 'GET_PEDIDOS_FRECUENCIA',
                    pedidosFrecuencia: []
                });

                await dispatch(getFrecuencia());
            } catch (error) {
                console.error('Error loading frecuencias:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error al cargar frecuencias',
                    text2: 'Intenta nuevamente'
                });
                setIsLoadingData(false);
            }
        };

        loadFrecuencias();
    }, [dispatch]);

    useEffect(() => {
        // Solo actualizar cuando realmente cambien los pedidos desde Redux
        if (pedidos !== undefined) {
            // Debug: ver qué datos llegan
            if (__DEV__ && pedidos.length > 0) {
                console.log('Pedidos frecuencia cargados:', pedidos.length);
            }

            setState(prev => {
                const list = pedidos || [];
                const term = prev.terminoBuscador.trim();
                const filtered = term
                    ? list.filter((p: PedidoFrecuencia) => pedidoFrecuenciaMatchesBusqueda(p, term))
                    : list;
                return {
                    ...prev,
                    pedidos: list,
                    pedidosFiltrados: filtered,
                    initialLoading: false
                };
            });

            // Desactivar loading después de recibir datos
            setIsLoadingData(false);
        }
    }, [pedidos]);

    useEffect(() => {
        // Inicializar grupos filtrados cuando cambien los grupos
        if (grupos && grupos.length >= 0) {
            setGruposFiltrados(grupos);
        }
    }, [grupos]);

    const filtrarPedidos = useCallback((termino: string) => {
        if (!termino.trim()) {
            setState(prev => ({
                ...prev,
                pedidosFiltrados: pedidos
            }));
            return;
        }

        const filtrados = pedidos.filter((pedido: PedidoFrecuencia) =>
            pedidoFrecuenciaMatchesBusqueda(pedido, termino)
        );

        setState(prev => ({
            ...prev,
            pedidosFiltrados: filtrados
        }));
    }, [pedidos]);

    const filtrarGrupos = useCallback((termino: string) => {
        if (!termino.trim()) {
            setGruposFiltrados(grupos);
            return;
        }

        const busqueda = termino.toLowerCase();
        const gruposFiltrados = grupos.filter((grupo: GrupoFrecuencia) => {
            const diaSemanaNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            const nombreGrupo = String(grupo.nombre || '').toLowerCase();
            const tipoFrecuencia = String(grupo.tipo_frecuencia || '').toLowerCase();
            const diaSemanaNombre = grupo.dia_semana ? diaSemanaNames[grupo.dia_semana].toLowerCase() : '';
            const intervaloText = grupo.intervalo_semanas === 1 ? 'semanal' : grupo.intervalo_semanas === 2 ? 'cada 2 semanas' : grupo.intervalo_semanas === 3 ? 'cada 3 semanas' : `cada ${grupo.intervalo_semanas} semanas`;

            return (
                nombreGrupo.includes(busqueda) ||
                tipoFrecuencia.includes(busqueda) ||
                diaSemanaNombre.includes(busqueda) ||
                intervaloText.includes(busqueda) ||
                String(grupo.dia_mes || '').includes(busqueda) ||
                String(grupo.total_pedidos || '').includes(busqueda)
            );
        });

        setGruposFiltrados(gruposFiltrados);
    }, [grupos]);

    const handleSearch = (terminoBuscador: string) => {
        setState(prev => ({ ...prev, terminoBuscador }));

        if (activeTab === 'grupos') {
            filtrarGrupos(terminoBuscador);
        } else {
            filtrarPedidos(terminoBuscador);
        }
    };

    const onScroll = (e: any) => {
        const { final } = state;
        let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;

        if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            setState(prev => ({
                ...prev,
                final: final + 5,
                showSpin: true
            }));

            setTimeout(() => {
                setState(prev => ({ ...prev, showSpin: false }));
            }, 2000);
        }
    };

    const eliminarFrecuencia = (id: string) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de que deseas eliminar la frecuencia ${id}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => confirmarEliminacion(id),
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        );
    };

    const confirmarEliminacion = async (id: string) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const res = await axios.delete(`fre/frecuencia/${id}`);

            if (res.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Frecuencia Eliminada',
                    text2: 'La frecuencia se ha eliminado correctamente'
                });
                dispatch(getFrecuencia());
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: 'Tenemos un problema, inténtalo más tarde'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: 'Verifica tu conexión a internet'
            });
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const onRefresh = useCallback(() => {
        dispatch(getFrecuencia());
    }, [dispatch]);

    const handleEditFrecuencia = (pedido: PedidoFrecuencia) => {
        setState(prev => ({
            ...prev,
            showEditModal: true,
            editingFrecuencia: pedido
        }));
    };

    const handleCloseEditModal = () => {
        setState(prev => ({
            ...prev,
            showEditModal: false,
            editingFrecuencia: null
        }));
    };

    // Función para formatear el día (número + nombre)
    const formatDay = (dayValue: string | number, frecuencia: string = 'semanal'): string => {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        if (frecuencia === 'mensual') {
            return String(dayValue);
        }

        // Quincenal calendario: días del mes. Quincenal cada 2 sem.: dia1 es 1–7 como semanal
        if (frecuencia === 'quincenal') {
            return String(dayValue);
        }

        if (typeof dayValue === 'number') {
            return `${dayValue} ${dayNames[dayValue - 1] || ''}`;
        } else if (typeof dayValue === 'string' && !isNaN(Number(dayValue))) {
            const num = Number(dayValue);
            return `${num} ${dayNames[num - 1] || ''}`;
        } else if (typeof dayValue === 'string') {
            // Si ya es un nombre, encontrar su número
            const index = dayNames.indexOf(dayValue);
            if (index !== -1) {
                return `${index + 1} ${dayValue}`;
            }
            return dayValue;
        }
        return String(dayValue);
    };

    // Calcula próximas fechas de ejecución para frecuencias individuales (semanal, quincenal, mensual)
    const calcularFechasEjecucionIndividual = (pedido: PedidoFrecuencia): string[] => {
        if (!pedido || !pedido.frecuencia) return [];

        const fechas: string[] = [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Fecha límite: 3 meses desde hoy
        const fechaLimite = new Date(hoy);
        fechaLimite.setMonth(fechaLimite.getMonth() + 3);

        // Helper para formatear día y mes (DD-MM)
        const formatFecha = (d: Date) => {
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            return `${dia}-${mes}`;
        };

        const pushCadaNSemanas = (diaSemana: number, diasPaso: number) => {
            if (Number.isNaN(diaSemana) || diaSemana < 1 || diaSemana > 7) return;
            const diaJS = diaSemana === 7 ? 0 : diaSemana;
            let primeraFecha = new Date(hoy);
            while (primeraFecha.getDay() !== diaJS) {
                primeraFecha.setDate(primeraFecha.getDate() + 1);
            }
            let fechaActual = new Date(primeraFecha);
            while (fechaActual <= fechaLimite && fechas.length < 12) {
                fechas.push(formatFecha(fechaActual));
                fechaActual.setDate(fechaActual.getDate() + diasPaso);
            }
        };

        if (pedido.frecuencia === 'semanal' && pedido.dia1) {
            pushCadaNSemanas(Number(pedido.dia1), 7);
        } else if (pedido.frecuencia === 'tressemanas' && pedido.dia1) {
            pushCadaNSemanas(Number(pedido.dia1), 21);
        } else if (pedido.frecuencia === 'quincenal' && pedido.dia1) {
            const dom1 = Number(pedido.dia1);
            const dom2 =
                pedido.dia2 !== undefined && pedido.dia2 !== '' && pedido.dia2 !== null
                    ? Number(pedido.dia2)
                    : NaN;

            if (isQuincenalCalendarioIndividual(pedido.dia1, pedido.dia2)) {
                const candidatos: Date[] = [];
                let mesCursor = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                while (mesCursor <= fechaLimite && candidatos.length < 24) {
                    const y = mesCursor.getFullYear();
                    const m = mesCursor.getMonth();
                    const ultimo = new Date(y, m + 1, 0).getDate();
                    [dom1, dom2].forEach(dom => {
                        if (dom < 1 || dom > ultimo) return;
                        const cand = new Date(y, m, dom);
                        if (cand >= hoy && cand <= fechaLimite) {
                            candidatos.push(cand);
                        }
                    });
                    mesCursor.setMonth(m + 1);
                }
                candidatos.sort((a, b) => a.getTime() - b.getTime());
                const vistos = new Set<string>();
                for (const d of candidatos) {
                    const s = formatFecha(d);
                    if (!vistos.has(s) && fechas.length < 12) {
                        vistos.add(s);
                        fechas.push(s);
                    }
                }
            } else if (!Number.isNaN(dom1) && dom1 >= 1 && dom1 <= 7) {
                pushCadaNSemanas(dom1, 14);
            }
        } else if (pedido.frecuencia === 'mensual' && pedido.dia1) {
            const diaMes = Number(pedido.dia1);
            const diaSem = Number(pedido.dia2);
            const exigeSemana =
                !Number.isNaN(diaSem) && diaSem >= 1 && diaSem <= 7;
            if (!Number.isNaN(diaMes) && diaMes >= 1 && diaMes <= 31) {
                const fechaCursor = new Date(hoy);
                while (fechaCursor <= fechaLimite && fechas.length < 12) {
                    const year = fechaCursor.getFullYear();
                    const month = fechaCursor.getMonth();
                    const ultimo = new Date(year, month + 1, 0).getDate();
                    const dom = Math.min(diaMes, ultimo);
                    const fechaMes = new Date(year, month, dom);

                    if (fechaMes >= hoy && fechaMes <= fechaLimite) {
                        if (!exigeSemana || fechaCoincideDiaSemana(fechaMes, diaSem)) {
                            fechas.push(formatFecha(fechaMes));
                        }
                    }

                    fechaCursor.setMonth(month + 1);
                    fechaCursor.setDate(1);
                }
            }
        }

        return fechas;
    };

    const handleEditSuccess = (updatedData?: PedidoFrecuencia) => {
        if (updatedData) {
            const merged = pedidos.map(pedido =>
                String(pedido.pedido_id) === String(updatedData.pedido_id) ? { ...pedido, ...updatedData } : pedido
            );
            dispatch({
                type: GET_PEDIDOS_FRECUENCIA,
                pedidosFrecuencia: merged
            });
            setState(prev => ({
                ...prev,
                pedidos: merged,
                pedidosFiltrados: prev.terminoBuscador.trim()
                    ? prev.pedidosFiltrados.map(pedido =>
                          String(pedido.pedido_id) === String(updatedData.pedido_id) ? { ...pedido, ...updatedData } : pedido
                      )
                    : merged,
                showEditModal: false,
                editingFrecuencia: null
            }));
        } else {
            // Fallback: llamar al backend si no hay datos actualizados
            dispatch(getFrecuencia());
            setState(prev => ({
                ...prev,
                showEditModal: false,
                editingFrecuencia: null
            }));
        }
    };

    const handleCreateGrupoSuccess = async () => {
        // Recargar frecuencias y grupos
        await dispatch(getFrecuencia());
    };

    const handleOpenCreateGrupoModal = () => {
        setShowCreateGrupoModal(true);
    };

    const handleCloseCreateGrupoModal = () => {
        setShowCreateGrupoModal(false);
    };

    const handleEditGrupo = (grupo: GrupoFrecuencia) => {
        setEditingGrupo(grupo);
        setShowEditGrupoModal(true);
    };

    const handleCloseEditGrupoModal = () => {
        setShowEditGrupoModal(false);
        setEditingGrupo(null);
    };

    const handleEditGrupoSuccess = async () => {
        await dispatch(getFrecuencia());
    };

    const handleVerPedidosGrupo = (grupo: GrupoFrecuencia) => {
        setViewingGrupo(grupo);
        setShowVerPedidosModal(true);
    };

    const handleCloseVerPedidosModal = () => {
        setShowVerPedidosModal(false);
        setViewingGrupo(null);
    };

    const eliminarGrupo = (id: number) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de que deseas eliminar este grupo de frecuencia?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => confirmarEliminacionGrupo(id),
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        );
    };

    const confirmarEliminacionGrupo = async (id: number) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const res = await axios.delete(`fre/grupos/${id}`);

            if (res.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Grupo Eliminado',
                    text2: 'El grupo de frecuencia se ha eliminado correctamente'
                });
                dispatch(getFrecuencia());
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: res.data.message || 'Tenemos un problema, inténtalo más tarde'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: 'Verifica tu conexión a internet'
            });
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const { terminoBuscador, pedidosFiltrados, showSpin, loading, showEditModal, editingFrecuencia } = state;

    const individualesFiltrados = pedidosFiltrados.filter((p: PedidoFrecuencia) => !(p as any).grupo_id);

    // Mostrar preloading mientras se cargan los datos
    if (isLoadingData) {
        return (
            <View style={style.container}>
                <View style={style.header}>
                    <View style={style.headerContent}>
                        <View style={style.headerTextContainer}>
                            <Text style={style.titulo}>Pedidos Frecuentes</Text>
                            <Text style={style.subtitulo}>Cargando...</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                    <ActivityIndicator size="large" color="#002587" style={{ marginBottom: 20 }} />
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#002587', marginBottom: 8 }}>
                        Cargando pedidos frecuentes...
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 40 }}>
                        Esto puede tomar unos momentos
                    </Text>
                </View>
                <Footer navigation={navigation} />
            </View>
        );
    }

    return (
        <View style={style.container}>
            {/* Header mejorado */}
            <View style={style.header}>
                <View style={style.headerContent}>
                    <View style={style.headerTextContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={style.titulo}>Pedidos Frecuentes</Text>
                                <Text style={style.subtitulo}>
                                    {activeTab === 'individuales'
                                        ? `${individualesFiltrados.length} frecuencias individuales`
                                        : `${terminoBuscador ? gruposFiltrados.length : grupos.length} grupos de frecuencias`
                                    }
                                    {activeTab === 'grupos' && (terminoBuscador ? gruposFiltrados : grupos).length > 0 && (
                                        ` • ${(terminoBuscador ? gruposFiltrados : grupos).reduce((total: number, grupo: GrupoFrecuencia) => total + (grupo.total_pedidos || 0), 0)} pedidos totales`
                                    )}
                                </Text>
                            </View>
                            {activeTab === 'grupos' && (
                                <TouchableOpacity
                                    onPress={handleOpenCreateGrupoModal}
                                    style={{
                                        backgroundColor: '#002587',
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 10
                                    }}
                                >
                                    <FontAwesome name="plus" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                        Grupo
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    {activeTab === 'individuales' && (
                        <View style={style.headerStats}>
                            <View style={style.statItem}>
                                <Text style={style.statNumber}>
                                    {individualesFiltrados.filter(p => p.frecuencia === 'semanal').length}
                                </Text>
                                <Text style={style.statLabel}>Semanal</Text>
                            </View>
                            <View style={style.statItem}>
                                <Text style={style.statNumber}>
                                    {individualesFiltrados.filter(p => p.frecuencia === 'quincenal').length}
                                </Text>
                                <Text style={style.statLabel}>Cada 2 sem.</Text>
                            </View>
                            <View style={style.statItem}>
                                <Text style={style.statNumber}>
                                    {individualesFiltrados.filter(p => p.frecuencia === 'mensual').length}
                                </Text>
                                <Text style={style.statLabel}>Mensual</Text>
                            </View>
                            <View style={style.statItem}>
                                <Text style={style.statNumber}>
                                    {individualesFiltrados.filter(p => p.frecuencia === 'tressemanas').length}
                                </Text>
                                <Text style={style.statLabel}>Cada 3 sem.</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Tabs Navigation */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#f8f9fa',
                borderBottomWidth: 1,
                borderBottomColor: '#dee2e6',
                paddingHorizontal: 20,
                paddingTop: 8
            }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderBottomWidth: 2,
                        borderBottomColor: activeTab === 'individuales' ? '#002587' : 'transparent',
                        marginRight: 8
                    }}
                    onPress={() => {
                        setActiveTab('individuales');
                        setState(prev => {
                            if (!prev.terminoBuscador.trim()) {
                                return { ...prev, pedidosFiltrados: pedidos };
                            }
                            return {
                                ...prev,
                                pedidosFiltrados: pedidos.filter((p: PedidoFrecuencia) =>
                                    pedidoFrecuenciaMatchesBusqueda(p, prev.terminoBuscador)
                                )
                            };
                        });
                    }}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome
                            name="list"
                            style={{
                                fontSize: 16,
                                color: activeTab === 'individuales' ? '#002587' : '#6c757d',
                                marginRight: 6
                            }}
                        />
                        <Text style={{
                            fontSize: 14,
                            fontWeight: activeTab === 'individuales' ? '700' : '500',
                            color: activeTab === 'individuales' ? '#002587' : '#6c757d'
                        }}>
                            Individuales ({individualesFiltrados.length})
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderBottomWidth: 2,
                        borderBottomColor: activeTab === 'grupos' ? '#002587' : 'transparent',
                        marginLeft: 8
                    }}
                    onPress={() => {
                        setActiveTab('grupos');
                        if (!terminoBuscador.trim()) {
                            setGruposFiltrados(grupos);
                        } else {
                            filtrarGrupos(terminoBuscador);
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome
                            name="users"
                            style={{
                                fontSize: 16,
                                color: activeTab === 'grupos' ? '#002587' : '#6c757d',
                                marginRight: 6
                            }}
                        />
                        <Text style={{
                            fontSize: 14,
                            fontWeight: activeTab === 'grupos' ? '700' : '500',
                            color: activeTab === 'grupos' ? '#002587' : '#6c757d'
                        }}>
                            Grupos ({terminoBuscador ? gruposFiltrados.length : grupos.length})
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Buscador mejorado */}
            <View style={style.searchContainer}>
                <FontAwesome name="search" style={style.searchIcon} />
                <TextInput
                    placeholder="Buscar por: cliente, razón social, dirección..."
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    onChangeText={handleSearch}
                    value={terminoBuscador}
                    style={style.searchInput}
                />
                {terminoBuscador.length > 0 && (
                    <TouchableOpacity
                        onPress={() => handleSearch('')}
                        style={style.clearButton}
                    >
                        <FontAwesome name="times" style={style.clearIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista mejorada - Separada por tabs */}
            <ScrollView
                style={style.scrollContainer}
                onScroll={onScroll}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={['#002587']}
                        tintColor="#002587"
                    />
                }
            >
                {/* Tab de Grupos */}
                {activeTab === 'grupos' && (
                    <>
                        {gruposFiltrados.length > 0 ? (
                            <View style={{ marginBottom: 30, paddingTop: 20 }}>
                                {gruposFiltrados.map((grupo: GrupoFrecuencia, key: number) => {
                                    const diaSemanaNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                                    const intervaloText = grupo.intervalo_semanas === 1 ? 'Semanal' : grupo.intervalo_semanas === 2 ? 'Cada 2 semanas' : 'Cada 3 semanas';

                                    return (
                                        <View key={key} style={[style.cardContainer, { marginHorizontal: 20, marginBottom: 12, backgroundColor: '#e3f2fd', borderLeftWidth: 4, borderLeftColor: '#002587' }]}>
                                            <View style={style.cardContent}>
                                                <View style={style.cardHeader}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[style.razonSocial, { color: '#002587' }]}>{grupo.nombre}</Text>
                                                        {grupo.total_pedidos !== undefined && (
                                                            <Text style={{
                                                                fontSize: 12,
                                                                color: '#666',
                                                                marginTop: 4
                                                            }}>
                                                                {grupo.total_pedidos} {grupo.total_pedidos === 1 ? 'pedido asignado' : 'pedidos asignados'}
                                                            </Text>
                                                        )}
                                                    </View>
                                                    <View style={{
                                                        backgroundColor: '#002587',
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 4,
                                                        borderRadius: 6
                                                    }}>
                                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                                                            {grupo.tipo_frecuencia.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={style.cardDetails}>
                                                    {grupo.tipo_frecuencia === 'semanal' && grupo.dia_semana && (
                                                        <View style={style.detailRow}>
                                                            <FontAwesome name="calendar" style={style.detailIcon} />
                                                            <Text style={style.detailText}>
                                                                {diaSemanaNames[grupo.dia_semana]} - {intervaloText}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    {grupo.tipo_frecuencia === 'mensual' && grupo.dia_mes && grupo.dia_semana_mensual && (
                                                        <>
                                                            <View style={style.detailRow}>
                                                                <FontAwesome name="calendar" style={style.detailIcon} />
                                                                <Text style={style.detailText}>
                                                                    Día del mes: {grupo.dia_mes}
                                                                </Text>
                                                            </View>
                                                            <View style={style.detailRow}>
                                                                <FontAwesome name="calendar-check-o" style={style.detailIcon} />
                                                                <Text style={style.detailText}>
                                                                    Día de la semana: {diaSemanaNames[grupo.dia_semana_mensual]}
                                                                </Text>
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            </View>

                                            <View style={style.cardActions}>
                                                <TouchableOpacity
                                                    onPress={() => handleVerPedidosGrupo(grupo)}
                                                    style={[style.actionButton, { backgroundColor: '#28a745' }]}
                                                >
                                                    <FontAwesome name="list" style={[style.actionIcon, { color: '#fff' }]} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => handleEditGrupo(grupo)}
                                                    style={style.actionButton}
                                                >
                                                    <FontAwesome name="edit" style={style.actionIcon} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => eliminarGrupo(grupo._id)}
                                                    style={[style.actionButton, style.deleteButton]}
                                                >
                                                    <FontAwesome name="trash" style={[style.actionIcon, style.deleteIcon]} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={style.emptyContainer}>
                                <FontAwesome name="users" style={style.emptyIcon} />
                                <Text style={style.emptyText}>
                                    {terminoBuscador ? 'No se encontraron grupos' : 'No hay grupos de frecuencias'}
                                </Text>
                                {terminoBuscador && (
                                    <Text style={style.emptySubtext}>
                                        Intenta con otros términos de búsqueda
                                    </Text>
                                )}
                            </View>
                        )}
                    </>
                )}

                {/* Tab de Frecuencias Individuales */}
                {activeTab === 'individuales' && (
                    <>
                        {individualesFiltrados.length > 0 ? (
                            <View style={{ marginBottom: 30, paddingTop: 20 }}>
                                {individualesFiltrados.map((pedido: PedidoFrecuencia) => (
                                    <View key={`${pedido.pedido_id}-${pedido.usuarioid}`} style={style.cardContainer}>
                                        <TouchableOpacity
                                            style={style.cardContent}
                                            onPress={() => navigation.navigate("verPerfil", {
                                                tipoAcceso: "editar",
                                                idUsuario: pedido.usuarioid
                                            })}
                                        >
                                            <View style={style.cardHeader}>
                                                <Text style={style.razonSocial}>{pedido.razon_social}</Text>
                                                <Text style={style.codigoText}># {pedido.codt}</Text>
                                            </View>

                                            {pedido.nombre && (
                                                <Text style={style.clienteName}>{pedido.nombre}</Text>
                                            )}

                                            <View style={style.cardDetails}>
                                                <View style={style.detailRow}>
                                                    <FontAwesome name="file-text-o" style={style.detailIcon} />
                                                    <Text style={style.detailText}>Pedido: {pedido.pedido_id}</Text>
                                                </View>

                                                <View style={style.detailRow}>
                                                    <FontAwesome name="shopping-cart" style={style.detailIcon} />
                                                    <Text style={style.detailText}>
                                                        {pedido.forma}: {
                                                            pedido.forma === "cantidad"
                                                                ? `${pedido.cantidadKl} KL`
                                                                : pedido.forma === "monto"
                                                                    ? `$${pedido.cantidadPrecio}`
                                                                    : pedido.forma
                                                        }
                                                    </Text>
                                                </View>

                                                <View style={style.detailRow}>
                                                    <FontAwesome name="repeat" style={style.detailIcon} />
                                                    <Text style={style.detailText}>
                                                        Frecuencia: {pedido.frecuencia}
                                                    </Text>
                                                </View>

                                                {pedido.frecuencia === "semanal" && pedido.dia1 && (
                                                    <View style={style.detailRow}>
                                                        <FontAwesome name="calendar" style={style.detailIcon} />
                                                        <Text style={style.detailText}>Día: {formatDay(pedido.dia1, 'semanal')}</Text>
                                                    </View>
                                                )}

                                                {pedido.frecuencia === "quincenal" && pedido.dia1 && (
                                                    <View style={style.detailRow}>
                                                        <FontAwesome name="calendar" style={style.detailIcon} />
                                                        <Text style={style.detailText}>
                                                            {isQuincenalCalendarioIndividual(pedido.dia1, pedido.dia2)
                                                                ? `Días del mes: ${pedido.dia1} y ${pedido.dia2}`
                                                                : `Cada 2 semanas: ${formatDay(pedido.dia1, 'semanal')}`}
                                                        </Text>
                                                    </View>
                                                )}

                                                {pedido.frecuencia === "tressemanas" && pedido.dia1 && (
                                                    <View style={style.detailRow}>
                                                        <FontAwesome name="calendar" style={style.detailIcon} />
                                                        <Text style={style.detailText}>
                                                            Cada 3 semanas: {formatDay(pedido.dia1, 'semanal')}
                                                        </Text>
                                                    </View>
                                                )}

                                                {pedido.frecuencia === "mensual" && pedido.dia1 && (
                                                    <View style={style.detailRow}>
                                                        <FontAwesome name="calendar" style={style.detailIcon} />
                                                        <Text style={style.detailText}>
                                                            Día del mes: {formatDay(pedido.dia1, 'mensual')}
                                                            {pedido.dia2 !== undefined &&
                                                            pedido.dia2 !== '' &&
                                                            pedido.dia2 !== null &&
                                                            !Number.isNaN(Number(pedido.dia2)) &&
                                                            Number(pedido.dia2) >= 1 &&
                                                            Number(pedido.dia2) <= 7
                                                                ? ` · ${formatDay(Number(pedido.dia2), 'semanal')}`
                                                                : ''}
                                                        </Text>
                                                    </View>
                                                )}

                                                {/* Próximas fechas de ejecución para frecuencias individuales */}
                                                {(() => {
                                                    const fechas = calcularFechasEjecucionIndividual(pedido);
                                                    if (!fechas || fechas.length === 0) return null;

                                                    return (
                                                        <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e0e0e0' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                                                <FontAwesome name="calendar-check-o" style={[style.detailIcon, { color: '#002587' }]} />
                                                                <Text style={[style.detailText, { fontWeight: '600', color: '#002587' }]}>
                                                                    Próximas fechas de ejecución:
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                                                                {fechas.map((fecha, idx) => (
                                                                    <View
                                                                        key={idx}
                                                                        style={{
                                                                            backgroundColor: '#e3f2fd',
                                                                            paddingHorizontal: 10,
                                                                            paddingVertical: 4,
                                                                            borderRadius: 6,
                                                                            marginRight: 6,
                                                                            marginBottom: 4
                                                                        }}
                                                                    >
                                                                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#002587' }}>
                                                                            {fecha}
                                                                        </Text>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        </View>
                                                    );
                                                })()}

                                                {pedido.punto_direccion && (
                                                    <View style={style.detailRow}>
                                                        <FontAwesome name="map-marker" style={style.detailIcon} />
                                                        <Text style={style.detailText}>
                                                            {pedido.punto_direccion}
                                                            {pedido.punto_capacidad && ` (${pedido.punto_capacidad} kg)`}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>

                                        <View style={style.cardActions}>
                                            <TouchableOpacity
                                                onPress={() => handleEditFrecuencia(pedido)}
                                                style={style.actionButton}
                                            >
                                                <FontAwesome name="edit" style={style.actionIcon} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => eliminarFrecuencia(pedido.pedido_id)}
                                                style={[style.actionButton, style.deleteButton]}
                                            >
                                                <FontAwesome name="trash" style={[style.actionIcon, style.deleteIcon]} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={style.emptyContainer}>
                                <FontAwesome name="list" style={style.emptyIcon} />
                                <Text style={style.emptyText}>
                                    {terminoBuscador ? 'No se encontraron frecuencias' : 'No hay frecuencias individuales'}
                                </Text>
                                {terminoBuscador && (
                                    <Text style={style.emptySubtext}>
                                        Intenta con otros términos de búsqueda
                                    </Text>
                                )}
                            </View>
                        )}
                    </>
                )}

                {showSpin && (
                    <View style={style.loadingContainer}>
                        <ActivityIndicator size="small" color="#002587" />
                        <Text style={style.loadingText}>Cargando más...</Text>
                    </View>
                )}
            </ScrollView>

            <Footer navigation={navigation} />
            <Toast />

            {/* Modal de edición */}
            <EditarFrecuenciaModal
                key={editingFrecuencia ? String(editingFrecuencia.pedido_id) : 'cerrado'}
                visible={showEditModal}
                onClose={handleCloseEditModal}
                frecuencia={editingFrecuencia}
                onSuccess={handleEditSuccess}
            />

            {/* Modal de crear grupo */}
            <CrearGrupoFrecuenciaModal
                visible={showCreateGrupoModal}
                onClose={handleCloseCreateGrupoModal}
                onSuccess={handleCreateGrupoSuccess}
            />

            {/* Modal de editar grupo */}
            <EditarGrupoFrecuenciaModal
                visible={showEditGrupoModal}
                onClose={handleCloseEditGrupoModal}
                grupo={editingGrupo}
                onSuccess={handleEditGrupoSuccess}
            />

            {/* Modal de ver pedidos del grupo */}
            <VerPedidosGrupoModal
                visible={showVerPedidosModal}
                onClose={handleCloseVerPedidosModal}
                grupo={viewingGrupo}
                pedidos={pedidos}
                onPedidoRemoved={async () => {
                    // Recargar frecuencias y grupos para actualizar los conteos
                    await dispatch(getFrecuencia());
                }}
            />
        </View>
    );
};

export default Frecuencia; 
