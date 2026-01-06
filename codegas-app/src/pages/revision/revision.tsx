import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { style } from './style';
import { connect } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { DataContext } from '../../context/context';
import { getRevisiones, getRevisionByPunto, getTanquesByPunto, getAllTanques } from '../../redux/actions/revisionActions';
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
    console.log('🔍 [Revision] Parámetros recibidos:', params);
    setLoading(true);

    try {
      if (params && params.puntoId) {
        console.log('✅ [Revision] Cargando tanques por punto:', params.puntoId);
        const response = await getTanquesByPunto(params.puntoId);
        setData(response?.tanque || []);
      } else {
        console.log('📋 [Revision] Cargando todos los tanquesssss');
        const searchTerm = terminoBuscador.trim();
        const response = await getAllTanques(0, 0, searchTerm);
        console.log('[Revision] Todos los tanques:', response);
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

  const handleOpenTanque = (tanque: any) => {
    const clienteId = tanque?.usuarioId ?? tanque?.usuarioid ?? route?.params?.clienteId;
    const puntoId = tanque?.puntoId ?? tanque?.puntoid ?? route?.params?.puntoId;

    if (!clienteId || !puntoId) {
      Alert.alert('Información incompleta', 'Este tanque no tiene un cliente o punto asociado.');
      return;
    }

    navigation.navigate('nuevaRevision', {
      puntoId,
      clienteId,
      tanqueId: tanque?._id,
      tanque
    });
  };

  const renderRevisiones = () => {
    if (loading) {
      return (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator color="#002587" />
          <Text style={[style.textUsers, { marginTop: 8 }]}>Cargando tanques…</Text>
        </View>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={{ paddingVertical: 32 }}>
          <Text style={style.textUsers}>No hay tanques disponibles</Text>
        </View>
      );
    }

    return data.map((tanque: any, index: number) => {
      const clienteNombre = tanque?.razon_social
        ? `${tanque.razon_social}${tanque.codt ? ` / ${tanque.codt}` : ''}`
        : 'Sin cliente asignado';
      const capacidad = tanque?.capacidad ? `${tanque.capacidad} Kg` : 'Capacidad no definida';
      const direccion = tanque?.direccion || 'Sin dirección registrada';

      return (
        <View
          style={[style.contenedorRevisiones, { backgroundColor: '#fff' }]}
          key={`${tanque?._id ?? 'tanque'}-${index}`}
        >
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => handleOpenTanque(tanque)}>
            <View style={{ width: '90%' }}>
              <Text style={style.textUsers}>Tanque: {tanque?.placaText || '-'}</Text>
              <Text style={style.textUsers}>Código: {tanque?.codigoActivo || '-'}</Text>
              <Text style={style.textUsers}>Capacidad: {capacidad}</Text>
              <Text style={style.textUsers}>{clienteNombre}</Text>
              <Text style={style.textUsers}>{direccion}</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <FontAwesome name={'angle-right'} style={style.iconCerrar} />
            </View>
          </TouchableOpacity>
          {Array.isArray(tanque?.data) && tanque.data.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={style.textUsers}>Alertas registradas: {tanque.data.length}</Text>
            </View>
          )}
          {acceso === 'admin' && (
            <>
              <View style={[style.separador, { width: '100%' }]}></View>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('cerrarTanque', { tanqueId: tanque?._id })}>
                <Text>
                  Cerrar Tanque <FontAwesome name='times-circle' style={style.iconCerrarTanque} />
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    });
  }
  return (
    <View style={style.containerTanque}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="Buscar tanque"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          onChangeText={(terminoBuscador) => setTerminoBuscador(terminoBuscador)}
          value={terminoBuscador}
          style={[style.inputCabezera]}
        />
      </View>

      <ScrollView style={{ marginBottom: 85 }} keyboardDismissMode="on-drag">
        {loading ? (
          <ActivityIndicator size="large" color="#00218b" />
        ) : (
          renderRevisiones()
        )}
      </ScrollView>


      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#00218b',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        onPress={() => {
          const params = route?.params;
          if (params) {
            navigation.navigate('nuevaRevision', {
              puntoId: params.puntoId,
              clienteId: params.clienteId,
              direccion: params.direccion,
              capacidad: params.capacidad,
              observacion: params.observacion,
            })
          } else {
            console.error("No hay parámetros disponibles para crear nueva revisión");
          }
        }}
      >
        <FontAwesome name="plus" style={{ color: 'white', fontSize: 24 }} />
      </TouchableOpacity>


      <Footer navigation={navigation} />
    </View>
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
