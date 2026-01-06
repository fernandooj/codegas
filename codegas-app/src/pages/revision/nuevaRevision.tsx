import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import TomarFoto from '../components/tomarFoto';
import SubirDocumento from '../components/subirDocumento';
import { DataContext } from '../../context/context';
import { getUsuarios, getPointsByClient } from '../../redux/actions/usuarioActions';
import { createRevision } from '../../redux/actions/revisionActions';
import {
    TANQUE_FIELDS,
    MEDIA_IMAGE_FIELDS,
    MEDIA_DOC_FIELDS,
    cardShadow,
    YEAR_OPTIONS
} from './nuevaRevision.constants';
import { style } from './style';
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
} from './nuevaRevision.types';

const AnyProgressStep = ProgressStep as unknown as React.ComponentType<any>;

const NuevaRevision: React.FC<NuevaRevisionProps> = ({ navigation }) => {
    const { acceso, userId } = useContext(DataContext) as any;
    const dispatch = useDispatch();

    const clientesRedux = useSelector((state: RootState) => state.usuario.usuarios || []);

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

    const imageFieldKeys = useMemo<MediaKey[]>(() => MEDIA_IMAGE_FIELDS.map(field => field.key), []);
    const documentFieldKeys = useMemo<MediaKey[]>(() => MEDIA_DOC_FIELDS.map(field => field.key), []);

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

    const handleTanqueChange = (key: TanqueFieldKey, value: string) => {
        setTanqueForm(prev => ({ ...prev, [key]: value }));
        if (!stepOneBlock) {
            setStepOneBlock(true);
        }
        setTanqueLinked(false);
    };

    const handleMediaChange = (key: MediaKey, value: any[]) => {
        setMedia(prev => ({ ...prev, [key]: value }));
        setMediaDirty(true);
        setStepTwoBlock(true);
    };

    const loadPuntos = async (clienteId: string) => {
        try {
            setLoadingPuntos(true);
            const response = await getPointsByClient(clienteId);
            const puntos = response?.puntos || [];
            setPuntosCliente(puntos);
            const defaultPunto = puntos.length === 1 ? puntos[0] : null;
            setSelectedPunto(defaultPunto);
            setTanqueLinked(false);
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

    const handleStepOneNext = async () => {
        if (stepOneSaving) {
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
                placaText: sanitizeString(tanqueForm.placaText),
                fabricante: sanitizeString(tanqueForm.fabricante),
                registroOnac: sanitizeString(tanqueForm.registroOnac),
                fechaUltimaRev: sanitizeString(tanqueForm.fechaUltimaRev),
                nPlaca: sanitizeString(tanqueForm.nPlaca),
                codigoActivo: sanitizeString(tanqueForm.codigoActivo),
                serie: sanitizeString(tanqueForm.serie),
                anoFabricacion: sanitizeString(tanqueForm.anoFabricacion),
                existeTanque: sanitizeString(tanqueForm.existeTanque),
                ultimRevTotal: sanitizeString(tanqueForm.ultimRevTotal),
                propiedad: sanitizeString(tanqueForm.propiedad),
                usuarioCrea: userId
            };

            const { data } = await axios.post('/tan/tanque', payload);

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

        const uploads: Array<{
            key: MediaKey;
            payload: Array<{ imagen: string; mime: string; name: string }>;
        }> = [];

        [...imageFieldKeys, ...documentFieldKeys].forEach(key => {
            const items = media[key];
            if (!Array.isArray(items) || items.length === 0) {
                return;
            }

            const isDocument = documentFieldKeys.includes(key);
            const payload = items
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

                    return {
                        imagen: normalized,
                        mime,
                        name: item?.name || `${key}-${index}.${isDocument ? 'pdf' : 'jpg'}`
                    };
                })
                .filter((value): value is { imagen: string; mime: string; name: string } => Boolean(value));

            if (payload.length > 0) {
                uploads.push({ key, payload });
            }
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
                await axios.put(`/tan/tanque/images/${tanqueId}/${upload.key}`, {
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
                Alert.alert('Tanque pendiente', 'Crea el tanque antes de finalizar la revisión.');
                setSubmitting(false);
                setCurrentStep(0);
                return;
            }

            if (!tanqueLinked) {
                const asignacion = {
                    usuarioId: selectedCliente._id,
                    puntoId: selectedPunto._id,
                    tanqueId
                };

                const { data } = await axios.put('/tan/tanque/add-user', asignacion);

                if (!data?.status) {
                    throw new Error('No se pudo asignar el tanque al cliente');
                }

                setTanqueLinked(true);
            }

            const payload = {
                usuarioId: selectedCliente._id,
                puntoId: selectedPunto._id,
                usuarioCrea: userId,
                tanque: tanqueForm,
                media
            };

            await createRevision(payload);

            Alert.alert(
                'Revisión creada',
                'Se guardó la información de la revisión correctamente.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Error creando revisión:', error);
            Alert.alert('Error', 'No pudimos crear la revisión. Intenta nuevamente.');
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
                        <Text style={style.headerTitle}>Nueva revisión</Text>
                        <Text style={style.headerSubtitle}>
                            Completa los datos del tanque y adjunta la evidencia.
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
                        label="Datos del tanque"
                        nextBtnText={stepOneSaving ? 'Guardando...' : 'Siguiente'}
                        nextBtnStyle={[style.stepButton, (!requiredFieldsFilled || stepOneSaving) && style.stepButtonDisabled]}
                        nextBtnTextStyle={style.stepButtonText}
                        previousBtnStyle={style.hiddenButton}
                        nextBtnDisabled={!requiredFieldsFilled || stepOneSaving}
                        onNext={handleStepOneNext}
                        errors={stepOneBlock}
                    >
                        <ScrollView contentContainerStyle={style.stepContent}>
                            <View style={[style.card, cardShadow]}>
                                <Text style={style.cardTitle}>Información básica</Text>
                                <Text style={style.cardDescription}>
                                    Registra la información principal del tanque. Todos los campos son obligatorios.
                                </Text>

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
                                                            return value ? value : field.placeholder;
                                                        })()}
                                                    </Text>
                                                    <FontAwesome
                                                        name="chevron-down"
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
                            <View style={[style.card, cardShadow]}>
                                <Text style={style.cardTitle}>Fotografíasss</Text>

                            </View>

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
                                <Text style={style.cardDescription}>
                                    Adjunta los documentos técnicos en formato PDF. Los archivos se almacenan en la nube automáticamente.
                                </Text>
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
                        <ScrollView contentContainerStyle={style.stepContent}>
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
                                            <FontAwesome name="search" style={style.stepButtonText} />
                                            <Text style={style.stepButtonText}>Buscar cliente</Text>
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
                                        ർഷ
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
        </SafeAreaView>
    );
};

export default NuevaRevision;


