import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from './style';
import { connect } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { DataContext } from '../../context/context';
import { getRevisiones, getRevisionByPunto } from '../../redux/actions/revisionActions';
import { getTanquesByPunto, getAllTanques } from '../../redux/actions/tanqueActions';
import Footer from '../components/footer';

type RevisionProps = {
  navigation: any;
  route: any;
  getRevisiones: (start: number, limit: number, search: string) => void;
  getRevisionByPunto: (idPunto: number) => void;
};

const Revision: React.FC<RevisionProps> = ({ navigation, route, getRevisiones, getRevisionByPunto }) => {
  const { acceso } = useContext(DataContext) as any
  const [terminoBuscador, setTerminoBuscador] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isFirstSearch = useRef(true);

  // const [revisiones, setRevisiones]= useState([])
  // const [revision_by_punto,, setRevision_by_punto]= useState([])

  useEffect(() => {
    loadRevisiones();
  }, [route?.params?.puntoId]);


  const loadRevisiones = async () => {
    const params = route?.params;
    console.log('🔍 [Tanque] Parámetros recibidos:', params);
    setLoading(true);

    try {
      if (params && params.puntoId) {
        console.log('✅ [Tanque] Cargando tanques por punto:', params.puntoId);
        const response = await getTanquesByPunto(params.puntoId);
        setData(response?.tanque || []);
      } else {
        console.log('📋 [Tanque] Cargando todos los tanques');
        const searchTerm = terminoBuscador.trim();
        const response = await getAllTanques(0, 0, searchTerm);
        console.log('[Tanque] Todos los tanques:', response);
        setData(response?.tanque || []);
      }
    } catch (error: any) {
      console.error('Error cargando tanques:', error?.message || error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }

    const handler = setTimeout(() => {
      loadRevisiones();
    }, 400);

    return () => clearTimeout(handler);
  }, [terminoBuscador]);

  const mapMediaField = (items: any[] | undefined) => {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .map((item: any, index: number) => {
        let parsed = item;

        if (typeof item === 'string') {
          try {
            parsed = JSON.parse(item);
          } catch (_error) {
            parsed = { url: item };
          }
        }

        if (!parsed || typeof parsed !== 'object') {
          return null;
        }

        const url = parsed.url || parsed.uri || parsed.imagen || parsed.s3Url || '';

        if (!url || typeof url !== 'string') {
          return null;
        }

        return {
          ...parsed,
          uri: url,
          url,
          nombre: parsed.nombre || parsed.name || `archivo-${index + 1}`,
          name: parsed.nombre || parsed.name || `archivo-${index + 1}`,
          fecha: parsed.fecha || new Date().toISOString()
        };
      })
      .filter((value): value is { uri: string } => Boolean(value));
  };

  const mapTanqueToForm = (tanque: any) => {
    if (!tanque || typeof tanque !== 'object') {
      return null;
    }

    const normalizeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value;
      return String(value);
    };

    return {
      capacidad: normalizeValue(tanque.capacidad),
      placa_text: normalizeValue(tanque.placa_text),
      fabricante: normalizeValue(tanque.fabricante),
      registro_onac: normalizeValue(tanque.registro_onac),
      fecha_mantenimiento: normalizeValue(tanque.fecha_mantenimiento),
      fecha_ultima_rev: normalizeValue(tanque.fecha_ultima_rev),
      n_placa: normalizeValue(tanque.n_placa),
      codigo_activo: normalizeValue(tanque.codigo_activo),
      serie: normalizeValue(tanque.serie),
      ano_fabricacion: normalizeValue(tanque.ano_fabricacion),
      existe_tanque: normalizeValue(tanque.existe_tanque),
      propiedad: normalizeValue(tanque.propiedad),
      usuario_crea: normalizeValue(tanque.usuario_crea),
      punto_id: normalizeValue(tanque.punto_id),
      usuario_id: normalizeValue(tanque.usuario_id),
    };
  };

  const handleOpenTanque = (tanque: any) => {
    const clienteId = tanque?.usuarioId ?? tanque?.usuario_id ?? tanque?.usuarioid ?? route?.params?.clienteId;
    const puntoId = tanque?.puntoId ?? tanque?.punto_id ?? tanque?.puntoid ?? route?.params?.puntoId;

    const tanqueForm = mapTanqueToForm(tanque);

    const media = {
      placa: mapMediaField(tanque?.placa),
      placaMantenimiento: mapMediaField(tanque?.placa_mantenimiento),
      placaFabricante: mapMediaField(tanque?.placa_fabricante),
      dossier: mapMediaField(tanque?.dossier),
      cerFabricante: mapMediaField(tanque?.cer_fabricante),
      cerOnac: mapMediaField(tanque?.cer_onac),
      visual: mapMediaField(tanque?.visual),
    };

    navigation.navigate('nuevoTanque', {
      modoEdicion: true,
      tanqueId: tanque?._id,
      clienteId: clienteId ?? null,
      puntoId: puntoId ?? null,
      tanqueForm,
      media,
      direccion: tanque?.direccion,
      capacidad: tanque?.capacidad,
      tanque: {
        ...tanque,
        usuario_id: clienteId,
        punto_id: puntoId,
        razon_social: tanque?.razon_social,
        codt: tanque?.codt,
        usuario_nombre: tanque?.usuario_nombre,
        usuario_email: tanque?.usuario_email,
        usuario_cedula: tanque?.usuario_cedula,
        usuario_celular: tanque?.usuario_celular,
      }
    });
  };

  const renderRevisiones = () => {
    if (loading) {
      return (
        <View style={style.loading}>
          <ActivityIndicator color="#002587" />
          <Text style={style.loadingText}>Cargando tanques…</Text>
        </View>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={style.emptyWrapper}>
          <View style={style.emptyBadge}>
            <FontAwesome name="database" style={style.emptyIcon} />
          </View>
          <Text style={style.emptyTitle}>No se encontraron tanques</Text>
          <Text style={style.emptySubtitle}>
            Registra un nuevo tanque con el botón inferior o ajusta tu búsqueda.
          </Text>
        </View>
      );
    }

    return data.map((tanque: any, index: number) => {
      const clienteNombre = tanque?.razon_social
        ? `${tanque.razon_social}${tanque.codt ? ` / ${tanque.codt}` : ''}`
        : 'Sin cliente asignado';
      const capacidad = tanque?.capacidad ? `${tanque.capacidad} Kg` : 'Capacidad no definida';
      const direccion = tanque?.direccion || 'Sin dirección registrada';
      const alertsCount = Array.isArray(tanque?.data) ? tanque.data.length : 0;

      return (
        <TouchableOpacity
          key={`${tanque?._id ?? 'tanque'}-${index}`}
          style={style.tankCard}
          activeOpacity={0.85}
          onPress={() => handleOpenTanque(tanque)}
        >
          <View style={style.tankHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={style.tankTitle}>{tanque?.codigo_activo || 'Tanque sin nombre'}</Text>
              <Text style={style.tankSubtitle}>{clienteNombre}</Text>
            </View>
            <View style={style.capacityPill}>
              <Text style={style.capacityText}>{capacidad}</Text>
            </View>
          </View>
          <Text style={style.tankMeta}>Registro ONAC: {tanque?.registro_onac || 'No asignado'}</Text>
          <Text style={style.tankMeta}>Dirección: {direccion}</Text>
          {tanque?.fabricante ? (
            <Text style={style.tankMeta}>Fabricante: {tanque.fabricante}</Text>
          ) : null}
          <View style={style.cardFooter}>
            {alertsCount > 0 ? (
              <View style={style.alertBadge}>
                <FontAwesome name="exclamation-triangle" style={style.alertIcon} />
                <Text style={style.alertText}>
                  {alertsCount} alerta{alertsCount !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : (
              <Text style={style.noAlertText}>Sin alertas registradas</Text>
            )}
            <FontAwesome name="angle-right" style={style.cardArrow} />
          </View>
        </TouchableOpacity>
      );
    });
  }
  return (
    <SafeAreaView style={style.container}>
      <View style={style.content}>
        <View style={style.searchBar}>
          <TextInput
            placeholder="Buscar tanque"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#adb5bd"
            onChangeText={setTerminoBuscador}
            value={terminoBuscador}
            style={style.searchInput}
          />
        </View>

        <ScrollView
          style={style.list}
          contentContainerStyle={style.listContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {renderRevisiones()}
        </ScrollView>

        <TouchableOpacity
          style={style.fab}
          activeOpacity={0.9}
          onPress={() => {
            const params = route?.params;
            if (params) {
              navigation.navigate('nuevoTanque', {
                puntoId: params.puntoId,
                clienteId: params.clienteId,
                direccion: params.direccion,
                capacidad: params.capacidad,
                observacion: params.observacion,
              });
            } else {
              Alert.alert(
                'Acción no disponible',
                'Selecciona un cliente y un punto para registrar un tanque.'
              );
            }
          }}
        >
          <FontAwesome name="plus" style={style.fabIcon} />
        </TouchableOpacity>
      </View>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const mapState = (state: any) => {
  return {
    usuarios: state.usuario.usuarios,
    usuariosFiltro: state.usuario.usuarios,
    revisiones: state.revision.revisiones,
    revision_by_punto: state.revision.revision_by_punto,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    getRevisiones: (start: number, limit: number, search: string) => {
      dispatch(getRevisiones(start, limit, search));
    },
    getRevisionByPunto: (idPunto: number) => {
      dispatch(getRevisionByPunto(idPunto));
    },
  };
};



export default connect(mapState, mapDispatch)(Revision);
