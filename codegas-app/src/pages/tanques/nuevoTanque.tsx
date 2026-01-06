import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import TomarFoto from '../components/tomarFoto';
import SubirDocumento from '../components/subirDocumento';
import { DataContext } from '../../context/context';
import { getUsuarios, getPointsByClient, getUserById } from '../../redux/actions/usuarioActions';
import {
    createTanque as createTanqueRequest,
    uploadTanqueImages,
    addUserTanque
} from '../../redux/actions/tanqueActions';
import {
    TANQUE_FIELDS,
    MEDIA_IMAGE_FIELDS,
    MEDIA_DOC_FIELDS,
    cardShadow,
    YEAR_OPTIONS
} from './nuevoTanque.constants';
import { style } from './style';
import Footer from '../components/footer';
import type {
    NuevaRevisionProps,
    RootState,
    TanqueForm,
    MediaState,
    TanqueFieldKey,
    MediaKey,
    ClienteItem,
    PuntoItem,
    TanqueFieldConfig,
    TanqueFieldOption
} from './nuevoTanque.types';

const AnyProgressStep = ProgressStep as unknown as React.ComponentType<any>;

const NuevaRevision: React.FC<NuevaRevisionProps> = ({ navigation, route }) => {
    const { acceso, userId } = useContext(DataContext) as any;
    const dispatch = useDispatch();

    const clientesRedux = useSelector((state: RootState) => state.usuario.usuarios || []);

    const modoEdicion = Boolean(route?.params?.modoEdicion);

    const [tanqueForm, setTanqueForm] = useState<TanqueForm>(() =>
        TANQUE_FIELDS.reduce((acc, field) => {
            acc[field.key] = '';
            return acc;
        }, {} as TanqueForm)
    );

    const [media, setMedia] = useState<MediaState>(() =>
        MEDIA_IMAGE_FIELDS.concat(MEDIA_DOC_FIELDS).reduce((acc, field) => {
            acc[field.key] = [];
            return acc;
        }, {} as MediaState)
    );

    const [clienteModalVisible, setClienteModalVisible] = useState(false);
    const [clienteSearch, setClienteSearch] = useState('');
    const [selectedCliente, setSelectedCliente] = useState<ClienteItem | null>(null);
    const [puntosCliente, setPuntosCliente] = useState<PuntoItem[]>([]);
    const [loadingPuntos, setLoadingPuntos] = useState(false);
    const [selectedPunto, setSelectedPunto] = useState<PuntoItem | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [pickerConfig, setPickerConfig] = useState<{
        field: TanqueFieldKey | null;
        options: TanqueFieldOption[];
        title: string;
    }>({
        field: null,
        options: [],
        title: ''
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [tanqueId, setTanqueId] = useState<string | null>(null);
    const [stepOneSaving, setStepOneSaving] = useState(false);
    const [stepOneBlock, setStepOneBlock] = useState(true);
    const [stepTwoSaving, setStepTwoSaving] = useState(false);
    const [stepTwoBlock, setStepTwoBlock] = useState(true);
    const [mediaDirty, setMediaDirty] = useState(false);
    const [tanqueLinked, setTanqueLinked] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerConfig, setDatePickerConfig] = useState<{
        field: TanqueFieldKey | null;
        title: string;
    }>({
        field: null,
        title: ''
    });
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [prefilledFromRoute, setPrefilledFromRoute] = useState(false);

    const imageFieldKeys = useMemo<MediaKey[]>(() => MEDIA_IMAGE_FIELDS.map(field => field.key), []);
    const documentFieldKeys = useMemo<MediaKey[]>(() => MEDIA_DOC_FIELDS.map(field => field.key), []);

    const normalizeValueToString = (value: any) => {
        if (value === undefined || value === null) {
            return '';
        }
        return `${value}`;
    };

    const normalizeMediaItems = (items: any): any[] => {
        if (!Array.isArray(items)) {
            return [];
        }

        return items
            .map(item => {
                if (!item) {
                    return null;
                }

                if (typeof item === 'string') {
                    try {
                        const parsed = JSON.parse(item);
                        if (parsed && typeof parsed === 'object') {
                            const uri = parsed.url || parsed.uri || parsed.imagen || '';
                            if (!uri) {
                                return null;
                            }
                            return {
                                ...parsed,
                                uri
                            };
                        }
                    } catch (_error) {
                        return { uri: item };
                    }
                    return { uri: item };
                }

                if (typeof item === 'object') {
                    const uri = item.uri || item.url || item.imagen || '';
                    if (!uri) {
                        return null;
                    }
                    return {
                        ...item,
                        uri
                    };
                }

                return null;
            })
            .filter((entry): entry is { uri: string } => Boolean(entry && entry.uri));
    };

    const buildUploadPayload = (key: MediaKey, items: any[]) => {
        const isDocument = documentFieldKeys.includes(key);

        return items
            .map((item, index) => {
                const rawBase64 = isDocument
                    ? item?.imagen ?? item?.base64
                    : item?.base64 ?? item?.imagen;

                if (!rawBase64 || typeof rawBase64 !== 'string') {
                    return null;
                }

                const mime = isDocument
                    ? 'application/pdf'
                    : (typeof item?.mime === 'string' && item.mime.length > 0 ? item.mime : 'image/jpeg');

                const normalized = rawBase64.startsWith('data:')
                    ? rawBase64
                    : `data:${mime};base64,${rawBase64}`;

                const fallbackName = `${key}-${Date.now()}-${index}.${isDocument ? 'pdf' : 'jpg'}`;

                return {
                    imagen: normalized,
                    mime,
                    name: item?.name || item?.nombre || fallbackName
                };
            })
            .filter((value): value is { imagen: string; mime: string; name: string } => Boolean(value));
    };

    const uploadMediaImmediately = async (key: MediaKey, items: any[]) => {
        if (!tanqueId || items.length === 0) {
            return;
        }

        const payload = buildUploadPayload(key, items);

        if (payload.length === 0) {
            setMediaDirty(false);
            return;
        }

        try {
            setStepTwoBlock(true);
            setStepTwoSaving(true);
            console.log('[tanque] upload media', {
                tanqueId,
                key,
                items: items.length,
                payload: payload.length
            });
            await uploadTanqueImages({
                idTanque: tanqueId,
                type: key,
                images: payload
            });
            setMediaDirty(false);
        } catch (error: any) {
            console.error('Error cargando medios del tanque:', {
                message: error?.message,
                status: error?.response?.status,
                url: error?.config?.url,
                data: error?.response?.data
            });
            Alert.alert(
                'Error',
                'No pudimos subir el archivo seleccionado. Intenta nuevamente.'
            );
            setMediaDirty(true);
        } finally {
            setStepTwoSaving(false);
            setStepTwoBlock(false);
        }
    };

    useEffect(() => {
        if (acceso !== 'cliente') {
            dispatch(getUsuarios(25, 0, 'cliente', '', userId) as any);
        } else if (userId) {
            const autoCliente: ClienteItem = { _id: userId };
            setSelectedCliente(autoCliente);
            loadPuntos(autoCliente._id);
        }
    }, [acceso, dispatch, userId]);

    useEffect(() => {
        if (clienteSearch.trim().length === 0) {
            return;
        }

        const timeout = setTimeout(() => {
            dispatch(getUsuarios(25, 0, 'cliente', clienteSearch.trim(), userId) as any);
        }, 400);

        return () => clearTimeout(timeout);
    }, [clienteSearch, dispatch, userId]);

    const filteredClientes = useMemo(() => {
        if (!clienteSearch) return clientesRedux;
        const needle = clienteSearch.toLowerCase();
        return clientesRedux.filter(cliente =>
            [cliente.razon_social, cliente.nombre, cliente.codt, cliente.email]
                .filter(Boolean)
                .some(value => (value ?? '').toLowerCase().includes(needle))
        );
    }, [clienteSearch, clientesRedux]);

    useEffect(() => {
        if (!modoEdicion || prefilledFromRoute) {
            return;
        }

        const params = route?.params ?? {};
        const initialFormSource = params.tanqueForm ?? params.tanque ?? {};

        setTanqueForm(prev => {
            const updated = { ...prev };
            TANQUE_FIELDS.forEach(field => {
                const fieldKey = field.key;
                const value = initialFormSource?.[fieldKey];
                if (value !== undefined && value !== null) {
                    updated[fieldKey] = normalizeValueToString(value);
                }
            });
            return updated;
        });

        if (params.media && typeof params.media === 'object') {
            const mediaKeyMap: Record<string, MediaKey> = {
                placa: 'placa',
                placaMantenimiento: 'placaMantenimiento',
                placa_mantenimiento: 'placaMantenimiento',
                placaFabricante: 'placaFabricante',
                placa_fabricante: 'placaFabricante',
                dossier: 'dossier',
                cerFabricante: 'cerFabricante',
                cer_fabricante: 'cerFabricante',
                cerOnac: 'cerOnac',
                cer_onac: 'cerOnac',
                visual: 'visual'
            };

            setMedia(prev => {
                const updated = { ...prev };
                Object.entries(params.media).forEach(([key, value]) => {
                    const mappedKey = mediaKeyMap[key];
                    if (!mappedKey) {
                        return;
                    }
                    updated[mappedKey] = normalizeMediaItems(value);
                });
                return updated;
            });
        }

        const initialTanqueId = params.tanqueId ?? params.tanque?._id;
        setTanqueId(initialTanqueId ? String(initialTanqueId) : null);
        setStepOneBlock(false);
        setMediaDirty(false);

        const clienteIdParam =
            params.clienteId ??
            params.tanque?.usuario_id ??
            params.tanque?.usuarioId ??
            params.tanque?.cliente_id;

        const puntoIdParam =
            params.puntoId ??
            params.tanque?.punto_id ??
            params.tanque?.puntoId;

        if (clienteIdParam) {
            const clienteIdStr = String(clienteIdParam);

            // Primero buscar el cliente en Redux
            const clienteEnRedux = clientesRedux.find(
                (c: ClienteItem) => String(c._id) === clienteIdStr
            );

            if (clienteEnRedux) {
                // Si está en Redux, usarlo directamente
                setSelectedCliente(clienteEnRedux);
                loadPuntos(clienteIdStr, puntoIdParam ? String(puntoIdParam) : undefined);
            } else {
                // Si no está en Redux, cargarlo desde el backend
                // Primero intentar usar los datos que vienen del tanque
                if (params.tanque?.razon_social || params.tanque?.codt) {
                    const clienteItem: ClienteItem = {
                        _id: clienteIdStr,
                        nombre: params.tanque?.nombre_cliente ?? params.tanque?.nombre ?? params.tanque?.usuario_nombre,
                        razon_social: params.tanque?.razon_social,
                        codt: params.tanque?.codt,
                        email: params.tanque?.email ?? params.tanque?.usuario_email,
                        cedula: params.tanque?.cedula ?? params.tanque?.usuario_cedula,
                        celular: params.tanque?.celular ?? params.tanque?.usuario_celular
                    };
                    setSelectedCliente(clienteItem);
                    loadPuntos(clienteIdStr, puntoIdParam ? String(puntoIdParam) : undefined);
                } else {
                    // Si no hay datos del tanque, cargar desde el backend
                    getUserById(clienteIdStr)
                        .then((response: any) => {
                            if (response?.user || response?.info) {
                                const userData = response.user || response.info;
                                const clienteItem: ClienteItem = {
                                    _id: clienteIdStr,
                                    nombre: userData.nombre,
                                    razon_social: userData.razon_social,
                                    codt: userData.codt,
                                    email: userData.email,
                                    cedula: userData.cedula,
                                    celular: userData.celular
                                };
                                setSelectedCliente(clienteItem);
                                loadPuntos(clienteIdStr, puntoIdParam ? String(puntoIdParam) : undefined);
                            } else {
                                // Fallback: crear un objeto mínimo
                                const clienteItem: ClienteItem = {
                                    _id: clienteIdStr
                                };
                                setSelectedCliente(clienteItem);
                                loadPuntos(clienteIdStr, puntoIdParam ? String(puntoIdParam) : undefined);
                            }
                        })
                        .catch((error: any) => {
                            console.error('Error cargando cliente:', error);
                            // Fallback: crear un objeto mínimo
                            const clienteItem: ClienteItem = {
                                _id: clienteIdStr
                            };
                            setSelectedCliente(clienteItem);
                            loadPuntos(clienteIdStr, puntoIdParam ? String(puntoIdParam) : undefined);
                        });
                }
            }
        }

        if (clienteIdParam && puntoIdParam) {
            setTanqueLinked(true);
        }

        setPrefilledFromRoute(true);
    }, [modoEdicion, prefilledFromRoute, route?.params, clientesRedux]);

    const requiredFieldsFilled = useMemo(() => {
        return TANQUE_FIELDS.every(field => {
            const value = tanqueForm[field.key];
            return value !== undefined && value.toString().trim().length > 0;
        });
    }, [tanqueForm]);

    const stepTwoReady = useMemo(
        () => media.placa.length > 0 && media.visual.length > 0,
        [media.placa.length, media.visual.length]
    );

    const stepThreeReady = selectedCliente !== null && selectedPunto !== null && Boolean(tanqueId);

    useEffect(() => {
        const shouldBlock = mediaDirty || !stepTwoReady;
        setStepTwoBlock(prev => (prev === shouldBlock ? prev : shouldBlock));
    }, [mediaDirty, stepTwoReady]);

    const handleTanqueChange = (key: TanqueFieldKey, value: string) => {
        setTanqueForm(prev => ({ ...prev, [key]: value }));
        if (!stepOneBlock) {
            setStepOneBlock(true);
        }
        setTanqueLinked(false);
    };

    const identifyMediaItem = (item: any, index: number) => {
        if (!item) {
            return `${index}-null`;
        }

        if (typeof item === 'string') {
            return item;
        }

        return item.uri || item.url || item.name || item.nombre || `${index}-${JSON.stringify(item)}`;
    };

    const handleMediaChange = (key: MediaKey, value: any[]) => {
        const previous = media[key] || [];
        const previousIdentifiers = new Set(previous.map((item, index) => identifyMediaItem(item, index)));

        const newItems = value.filter((item, index) => {
            const identifier = identifyMediaItem(item, index + previous.length);
            return !previousIdentifiers.has(identifier);
        });

        setMedia(prev => ({ ...prev, [key]: value }));

        if (newItems.length > 0 && tanqueId) {
            setMediaDirty(true);
            uploadMediaImmediately(key, newItems);
        } else if (!tanqueId) {
            setMediaDirty(true);
        } else {
            setMediaDirty(false);
        }
    };

    const loadPuntos = async (clienteId: string, preferredPuntoId?: string) => {
        try {
            setLoadingPuntos(true);
            const response = await getPointsByClient(clienteId);
            const puntos = response?.puntos || [];
            setPuntosCliente(puntos);
            const preferredId = preferredPuntoId ? String(preferredPuntoId) : null;
            const defaultPunto = preferredId
                ? puntos.find((punto: PuntoItem) => String(punto._id) === preferredId) || null
                : puntos.length === 1
                    ? puntos[0]
                    : null;
            setSelectedPunto(defaultPunto ?? null);
            if (preferredId && defaultPunto) {
                setTanqueLinked(true);
            } else {
                setTanqueLinked(false);
            }
        } catch (error) {
            Alert.alert('Error', 'No pudimos cargar los puntos del cliente.');
        } finally {
            setLoadingPuntos(false);
        }
    };

    const handleSelectCliente = (cliente: ClienteItem) => {
        setSelectedCliente(cliente);
        setSelectedPunto(null);
        setClienteModalVisible(false);
        loadPuntos(cliente._id);
        setTanqueLinked(false);
    };

    const handleSelectPunto = (punto: PuntoItem) => {
        setSelectedPunto(punto);
        setTanqueLinked(false);
    };

    const openPicker = (config: TanqueFieldConfig) => {
        let options: TanqueFieldOption[] = [];
        if (config.inputType === 'year') {
            options = YEAR_OPTIONS;
        } else if (config.options) {
            options = config.options;
        }

        setPickerConfig({
            field: config.key,
            options,
            title: config.label
        });
    };

    const closePicker = () => {
        setPickerConfig({ field: null, options: [], title: '' });
    };

    const handlePickerSelect = (value: string) => {
        if (pickerConfig.field) {
            handleTanqueChange(pickerConfig.field, value);
        }
        closePicker();
    };

    const sanitizeString = (value: string | null | undefined) => {
        if (value === undefined || value === null) {
            return null;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    };

    const toNullableNumber = (value: string | undefined) => {
        if (!value) {
            return null;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseDateValue = (value: string | undefined) => {
        if (!value) {
            return null;
        }
        const parts = value.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts.map(Number);
            if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
                return new Date(year, month - 1, day);
            }
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const formatDateHuman = (value: string | undefined) => {
        if (!value) {
            return '';
        }
        const parsed = parseDateValue(value);
        if (!parsed) {
            return value;
        }
        return parsed.toLocaleDateString();
    };

    const openDatePickerModal = (config: TanqueFieldConfig) => {
        const initialDate = parseDateValue(tanqueForm[config.key]) || new Date();
        setTempDate(initialDate);
        setDatePickerConfig({ field: config.key, title: config.label });
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        // En Android con display="default", el diálogo nativo se muestra sobre el Modal
        // Cuando el usuario selecciona una fecha, el diálogo se cierra y se dispara el evento
        if (Platform.OS === 'android') {
            // Cerrar el Modal primero
            setShowDatePicker(false);
            if (event.type === 'set' && selectedDate && datePickerConfig.field) {
                // El usuario confirmó la selección
                handleTanqueChange(datePickerConfig.field, formatDate(selectedDate));
                setDatePickerConfig({ field: null, title: '' });
            } else if (event.type === 'dismissed') {
                // El usuario canceló el diálogo nativo
                setDatePickerConfig({ field: null, title: '' });
            }
        } else {
            // En iOS, solo actualizamos la fecha temporal
            // El usuario debe presionar "Seleccionar" para confirmar
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
        setDatePickerConfig({ field: null, title: '' });
    };

    const handleDateConfirm = () => {
        if (datePickerConfig.field) {
            handleTanqueChange(datePickerConfig.field, formatDate(tempDate));
        }
        handleDateCancel();
    };

    const handleStepOneNext = async () => {
        if (stepOneSaving) {
            return;
        }

        if (modoEdicion && tanqueId) {
            setStepOneBlock(false);
            setCurrentStep(1);
            return;
        }

        if (tanqueId && !stepOneBlock) {
            setCurrentStep(1);
            return;
        }

        if (!requiredFieldsFilled) {
            Alert.alert('Información incompleta', 'Completa todos los campos obligatorios del tanque.');
            return;
        }

        try {
            setStepOneSaving(true);
            const payload = {
                capacidad: toNullableNumber(tanqueForm.capacidad),
                placa_text: sanitizeString(tanqueForm.placa_text),
                fabricante: sanitizeString(tanqueForm.fabricante),
                registro_onac: sanitizeString(tanqueForm.registro_onac),
                fecha_ultima_rev: sanitizeString(tanqueForm.fecha_ultima_rev),
                n_placa: sanitizeString(tanqueForm.n_placa),
                codigo_activo: sanitizeString(tanqueForm.codigo_activo),
                serie: sanitizeString(tanqueForm.serie),
                ano_fabricacion: sanitizeString(tanqueForm.ano_fabricacion),
                existe_tanque: sanitizeString(tanqueForm.existe_tanque),
                propiedad: sanitizeString(tanqueForm.propiedad),
                fecha_mantenimiento: sanitizeString(tanqueForm.fecha_mantenimiento),
                usuario_crea: userId
            };

            const { data } = await createTanqueRequest(payload);

            if (!data?.status) {
                throw new Error('No se pudo crear el tanque');
            }

            const newTanqueId = data.code ?? data.tanqueId ?? data.id;

            if (newTanqueId === undefined || newTanqueId === null) {
                throw new Error('No se recibió el identificador del tanque');
            }

            setTanqueId(String(newTanqueId));
            setStepOneBlock(false);
            setStepTwoBlock(true);
            setMediaDirty(false);
            setTanqueLinked(false);
            setCurrentStep(1);
        } catch (error) {
            console.error('Error creando tanque:', error);
            Alert.alert('Error', 'No pudimos guardar la información del tanque. Intenta nuevamente.');
        } finally {
            setStepOneSaving(false);
        }
    };

    const handleStepTwoNext = async () => {
        if (stepTwoSaving) {
            return;
        }

        if (!tanqueId) {
            Alert.alert('Tanque pendiente', 'Primero guarda la información del tanque para continuar.');
            setCurrentStep(0);
            return;
        }

        if (!stepTwoBlock && !mediaDirty) {
            setCurrentStep(2);
            return;
        }

        const uploads = [...imageFieldKeys, ...documentFieldKeys]
            .map(key => ({
                key,
                payload: buildUploadPayload(key, media[key])
            }))
            .filter((upload): upload is { key: MediaKey; payload: Array<{ imagen: string; mime: string; name: string }> } => {
                return upload.payload.length > 0;
            });

        if (uploads.length === 0) {
            setStepTwoBlock(false);
            setMediaDirty(false);
            setCurrentStep(2);
            return;
        }

        try {
            setStepTwoSaving(true);
            for (const upload of uploads) {
                await uploadTanqueImages({
                    idTanque: tanqueId,
                    type: upload.key,
                    images: upload.payload
                });
            }
            setStepTwoBlock(false);
            setMediaDirty(false);
            setCurrentStep(2);
        } catch (error) {
            console.error('Error cargando medios del tanque:', error);
            Alert.alert('Error', 'No pudimos subir las imágenes o documentos del tanque. Intenta nuevamente.');
        } finally {
            setStepTwoSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCliente || !selectedPunto) {
            Alert.alert('Información incompleta', 'Selecciona un cliente y un punto de servicio.');
            return;
        }

        try {
            setSubmitting(true);
            if (!tanqueId) {
                Alert.alert('Tanque pendiente', 'Crea el tanque antes de asignarlo.');
                setSubmitting(false);
                setCurrentStep(0);
                return;
            }

            // SIEMPRE llamar a addUserTanque para asignar el tanque al cliente y punto
            const asignacion = {
                usuarioId: selectedCliente._id,
                puntoId: selectedPunto._id,
                tanqueId: String(tanqueId)
            };

            console.log('[nuevoTanque] Asignando tanque al cliente y punto:', asignacion);

            const { data: asignacionData } = await addUserTanque(asignacion);
            console.log('[nuevoTanque] Respuesta de asignación:', asignacionData);

            if (!asignacionData?.status) {
                const errorMessage = asignacionData?.message || 'No se pudo asignar el tanque al cliente';
                console.error('[nuevoTanque] Error en asignación:', errorMessage);
                throw new Error(errorMessage);
            }

            console.log('[nuevoTanque] Tanque asignado correctamente al cliente y punto');

            Alert.alert(
                'Tanque asignado',
                'El tanque se ha asignado correctamente al cliente y punto de servicio.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            console.error('Error asignando tanque:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'No pudimos asignar el tanque. Intenta nuevamente.';
            Alert.alert('Error', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={style.screen}>
            <View style={style.header}>
                <View style={[style.headerCard, cardShadow]}>
                    <FontAwesome name="cubes" style={style.headerIcon} />
                    <View>
                        <Text style={style.headerTitle}>Nuevo tanque</Text>
                        <Text style={style.headerSubtitle}>
                            Completa los datos del tanque.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={style.stepsWrapper}>
                <ProgressSteps
                    activeStep={currentStep}
                    activeStepIconBorderColor="#002587"
                    completedProgressBarColor="#002587"
                    activeLabelColor="#002587"
                    labelColor="#adb5bd"
                    topOffset={12}
                >
                    <AnyProgressStep
                        label="Info tanque"
                        nextBtnText={stepOneSaving ? 'Guardando...' : 'Siguiente'}
                        nextBtnStyle={[style.stepButton, (!requiredFieldsFilled || stepOneSaving) && style.stepButtonDisabled]}
                        nextBtnTextStyle={style.stepButtonText}
                        previousBtnStyle={style.hiddenButton}
                        nextBtnDisabled={!requiredFieldsFilled || stepOneSaving}
                        onNext={handleStepOneNext}
                        errors={stepOneBlock}
                    >
                        <ScrollView
                            style={style.stepScroll}
                            contentContainerStyle={[style.stepContent, { paddingBottom: 100, flexGrow: 1 }]}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                        >
                            <View style={[style.card, cardShadow]}>
                                <View style={style.fieldsGrid}>
                                    {TANQUE_FIELDS.map(field => (
                                        <View key={field.key} style={style.inputGroup}>
                                            <Text style={style.inputLabel}>{field.label}</Text>
                                            {field.inputType === 'select' || field.inputType === 'year' ? (
                                                <TouchableOpacity
                                                    style={style.selectorButton}
                                                    onPress={() => openPicker(field)}
                                                >
                                                    <Text
                                                        style={
                                                            tanqueForm[field.key]
                                                                ? style.selectorValue
                                                                : style.selectorPlaceholder
                                                        }
                                                    >
                                                        {(() => {
                                                            const value = tanqueForm[field.key];
                                                            const options =
                                                                field.inputType === 'year'
                                                                    ? YEAR_OPTIONS
                                                                    : field.options || [];
                                                            const selected = options.find(
                                                                option => option.value === value
                                                            );
                                                            if (selected) {
                                                                return selected.label;
                                                            }
                                                            if (value) {
                                                                return value;
                                                            }
                                                            return field.placeholder;
                                                        })()}
                                                    </Text>
                                                    <FontAwesome
                                                        name="chevron-down"
                                                        style={style.selectorIcon}
                                                    />
                                                </TouchableOpacity>
                                            ) : field.inputType === 'date' ? (
                                                <TouchableOpacity
                                                    style={style.selectorButton}
                                                    onPress={() => openDatePickerModal(field)}
                                                >
                                                    <Text
                                                        style={
                                                            tanqueForm[field.key]
                                                                ? style.selectorValue
                                                                : style.selectorPlaceholder
                                                        }
                                                    >
                                                        {tanqueForm[field.key]
                                                            ? formatDateHuman(tanqueForm[field.key])
                                                            : field.placeholder}
                                                    </Text>
                                                    <FontAwesome
                                                        name="calendar"
                                                        style={style.selectorIcon}
                                                    />
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={style.inputWrapper}>
                                                    <TextInput
                                                        style={style.input}
                                                        placeholder={field.placeholder}
                                                        placeholderTextColor="#adb5bd"
                                                        value={tanqueForm[field.key]}
                                                        onChangeText={value => handleTanqueChange(field.key, value)}
                                                        keyboardType={field.keyboardType ?? 'default'}
                                                        underlineColorAndroid="transparent"
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </AnyProgressStep>

                    <AnyProgressStep
                        label="Soporte visual"
                        nextBtnText={stepTwoSaving ? 'Subiendo...' : 'Siguiente'}
                        previousBtnText="Atrás"
                        nextBtnStyle={[style.stepButton, (!stepTwoReady || stepTwoSaving) && style.stepButtonDisabled]}
                        nextBtnTextStyle={style.stepButtonText}
                        previousBtnStyle={style.stepButtonAlt}
                        previousBtnTextStyle={style.stepButtonAltText}
                        nextBtnDisabled={!stepTwoReady || stepTwoSaving}
                        onNext={handleStepTwoNext}
                        onPrevious={() => setCurrentStep(0)}
                        errors={stepTwoBlock}
                    >
                        <ScrollView contentContainerStyle={style.stepContent}>

                            {MEDIA_IMAGE_FIELDS.map(field => (
                                <View key={field.key} style={[style.card, cardShadow]}>
                                    <Text style={style.cardTitle}>{field.title}</Text>
                                    <Text style={style.cardDescription}>{field.helper}</Text>
                                    <TomarFoto
                                        titulo="Agregar fotos"
                                        source={media[field.key]}
                                        multiple
                                        limiteImagenes={5}
                                        imagenes={imagenes => handleMediaChange(field.key, imagenes)}
                                    />
                                </View>
                            ))}

                            <View style={[style.card, cardShadow]}>
                                <Text style={style.cardTitle}>Documentos</Text>
                            </View>

                            {MEDIA_DOC_FIELDS.map(field => (
                                <View key={field.key} style={[style.card, cardShadow]}>
                                    <Text style={style.cardTitle}>{field.title}</Text>
                                    <Text style={style.cardDescription}>{field.helper}</Text>
                                    <SubirDocumento
                                        titulo="Adjuntar documento"
                                        limiteImagenes={field.limit}
                                        source={media[field.key]}
                                        imagenes={(docs: any[]) => handleMediaChange(field.key, docs)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </AnyProgressStep>

                    <AnyProgressStep
                        label="Asignación"
                        previousBtnText="Atrás"
                        finishBtnText={submitting ? 'Guardando...' : 'Finalizar'}
                        previousBtnStyle={style.stepButtonAlt}
                        previousBtnTextStyle={style.stepButtonAltText}
                        nextBtnStyle={[style.stepButton, !stepThreeReady && style.stepButtonDisabled]}
                        nextBtnTextStyle={style.stepButtonText}
                        nextBtnDisabled={!stepThreeReady || submitting}
                        onPrevious={() => setCurrentStep(1)}
                        onSubmit={handleSubmit}
                    >
                        <ScrollView
                            contentContainerStyle={[style.stepContent, { paddingBottom: 200, minHeight: '100%' }]}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                        >
                            <View style={[style.card, cardShadow]}>
                                <Text style={style.cardTitle}>Cliente</Text>
                                <Text style={style.cardDescription}>
                                    Selecciona el cliente al que corresponde la revisión. Si eres cliente se muestra tu información.
                                </Text>

                                {selectedCliente ? (
                                    <View style={style.selectedClientCard}>
                                        <View style={style.selectedClientHeader}>
                                            <View style={style.avatar}>
                                                <FontAwesome name="user" style={style.avatarIcon} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={style.selectedClientName}>
                                                    {selectedCliente.razon_social || selectedCliente.nombre || 'Cliente'}
                                                </Text>
                                                {selectedCliente.codt && (
                                                    <Text style={style.selectedClientSub}>CODT: {selectedCliente.codt}</Text>
                                                )}
                                                {selectedCliente.email && (
                                                    <Text style={style.selectedClientSub}>{selectedCliente.email}</Text>
                                                )}
                                            </View>
                                            {acceso !== 'cliente' && (
                                                <TouchableOpacity
                                                    style={style.changeButton}
                                                    onPress={() => setClienteModalVisible(true)}
                                                >
                                                    <FontAwesome name="exchange" style={style.changeButtonIcon} />
                                                    <Text style={style.changeButtonText}>Cambiar</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ) : (
                                    acceso !== 'cliente' && (
                                        <TouchableOpacity
                                            style={[style.stepButton, style.fullWidth]}
                                            onPress={() => setClienteModalVisible(true)}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <FontAwesome name="search" style={{ fontSize: 16, color: '#fff' }} />
                                                <Text style={style.stepButtonText}>Buscar cliente</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>

                            <View style={[style.card, cardShadow]}>
                                <Text style={style.cardTitle}>Punto de servicio</Text>
                                <Text style={style.cardDescription}>
                                    Elige el punto donde se realizará la revisión y se encuentra el tanque.
                                </Text>

                                {loadingPuntos ? (
                                    <View style={style.loading}>
                                        <ActivityIndicator color="#002587" />
                                        <Text style={style.loadingText}>Cargando puntos...</Text>
                                    </View>
                                ) : puntosCliente.length === 0 ? (
                                    <View style={style.emptyState}>
                                        <FontAwesome name="map-marker" style={style.emptyStateIcon} />
                                        <Text style={style.emptyStateTitle}>Sin puntos disponibles</Text>
                                        <Text style={style.emptyStateText}>
                                            Selecciona un cliente para ver los puntos registrados.
                                        </Text>
                                    </View>
                                ) : (
                                    puntosCliente.map(punto => {
                                        const isSelected = punto._id === selectedPunto?._id;
                                        return (
                                            <TouchableOpacity
                                                key={punto._id}
                                                style={[
                                                    style.pointCard,
                                                    cardShadow,
                                                    isSelected && style.pointCardSelected
                                                ]}
                                                onPress={() => handleSelectPunto(punto)}
                                            >
                                                <View style={style.pointHeader}>
                                                    <View style={style.pointIcon}>
                                                        <FontAwesome name="map" style={style.pointIconSymbol} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={style.pointTitle}>{punto.direccion}</Text>
                                                        {punto.capacidad && (
                                                            <Text style={style.pointMeta}>
                                                                Capacidad: {punto.capacidad} Kg
                                                            </Text>
                                                        )}
                                                        {punto.nombre && (
                                                            <Text style={style.pointMeta}>Encargado: {punto.nombre}</Text>
                                                        )}
                                                        {punto.celular && (
                                                            <Text style={style.pointMeta}>Celular: {punto.celular}</Text>
                                                        )}
                                                    </View>
                                                    {isSelected && (
                                                        <FontAwesome name="check-circle" style={style.pointSelectedIcon} />
                                                    )}
                                                </View>
                                                {punto.observacion && (
                                                    <Text style={style.pointObservation}>{punto.observacion}</Text>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })
                                )}
                            </View>
                        </ScrollView>
                    </AnyProgressStep>
                </ProgressSteps>
            </View>

            <Footer navigation={navigation} />

            <Modal
                visible={clienteModalVisible}
                animationType="slide"
                onRequestClose={() => setClienteModalVisible(false)}
            >
                <SafeAreaView style={style.modalContainer}>
                    <View style={style.modalHeader}>
                        <Text style={style.modalTitle}>Buscar cliente</Text>
                        <TouchableOpacity onPress={() => setClienteModalVisible(false)}>
                            <FontAwesome name="times" style={style.modalCloseIcon} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={style.modalInput}
                        placeholder="Nombre, razón social, CODT o correo…"
                        placeholderTextColor="#adb5bd"
                        value={clienteSearch}
                        onChangeText={setClienteSearch}
                        autoFocus
                    />
                    <ScrollView>
                        {filteredClientes.length === 0 ? (
                            <View style={style.emptyState}>
                                <FontAwesome name="search" style={style.emptyStateIcon} />
                                <Text style={style.emptyStateTitle}>Sin resultados</Text>
                                <Text style={style.emptyStateText}>Intenta con otro término de búsqueda.</Text>
                            </View>
                        ) : (
                            filteredClientes.map(cliente => (
                                <TouchableOpacity
                                    key={cliente._id}
                                    style={style.modalItem}
                                    onPress={() => handleSelectCliente(cliente)}
                                >
                                    <View style={style.modalAvatar}>
                                        <FontAwesome name="user" style={style.modalAvatarIcon} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={style.modalItemTitle}>
                                            {cliente.razon_social || cliente.nombre || 'Cliente'}
                                        </Text>
                                        {cliente.codt && (
                                            <Text style={style.modalItemSub}>CODT: {cliente.codt}</Text>
                                        )}
                                        {cliente.email && (
                                            <Text style={style.modalItemSub}>{cliente.email}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <Modal visible={pickerConfig.field !== null} animationType="slide" onRequestClose={closePicker}>
                <SafeAreaView style={style.pickerModalContainer}>
                    <View style={style.modalHeader}>
                        <Text style={style.modalTitle}>{pickerConfig.title}</Text>
                        <TouchableOpacity onPress={closePicker}>
                            <FontAwesome name="times" style={style.modalCloseIcon} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {pickerConfig.options.map(option => {
                            const isSelected =
                                pickerConfig.field !== null &&
                                tanqueForm[pickerConfig.field] === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        style.pickerOption,
                                        isSelected && style.pickerOptionSelected
                                    ]}
                                    onPress={() => handlePickerSelect(option.value)}
                                >
                                    <Text
                                        style={[
                                            style.pickerOptionText,
                                            isSelected && style.pickerOptionTextSelected
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <FontAwesome
                                            name="check"
                                            style={style.pickerOptionIconSelected}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <TouchableOpacity style={style.pickerCancelButton} onPress={closePicker}>
                        <Text style={style.pickerCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

            {Platform.OS === 'android' ? (
                // En Android, usar Modal para evitar que interfiera con el layout
                showDatePicker && (
                    <Modal
                        visible={showDatePicker}
                        transparent
                        animationType="fade"
                        onRequestClose={handleDateCancel}
                    >
                        <View style={style.dateModalOverlay}>
                            <View style={[style.dateModalContent, cardShadow]}>
                                <View style={style.modalHeader}>
                                    <Text style={style.modalTitle}>{datePickerConfig.title}</Text>
                                    <TouchableOpacity onPress={handleDateCancel}>
                                        <FontAwesome name="times" style={style.modalCloseIcon} />
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={tempDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            </View>
                        </View>
                    </Modal>
                )
            ) : (
                // En iOS, mostrar el modal personalizado con el picker
                <Modal
                    visible={showDatePicker}
                    transparent
                    animationType="fade"
                    onRequestClose={handleDateCancel}
                >
                    <View style={style.dateModalOverlay}>
                        <View style={[style.dateModalContent, cardShadow]}>
                            <View style={style.modalHeader}>
                                <Text style={style.modalTitle}>{datePickerConfig.title}</Text>
                                <TouchableOpacity onPress={handleDateCancel}>
                                    <FontAwesome name="times" style={style.modalCloseIcon} />
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                style={style.datePicker}
                            />
                            <View style={style.dateModalActions}>
                                <TouchableOpacity onPress={handleDateCancel}>
                                    <Text style={style.pickerCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.dateConfirmButton} onPress={handleDateConfirm}>
                                    <Text style={style.dateConfirmText}>Seleccionar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

export default NuevaRevision;


