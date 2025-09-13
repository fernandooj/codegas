import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { style } from './style';
import { connect } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import axios from 'axios'
import { DataContext } from '../../context/context';
import { getRevisiones, getRevisionByPunto } from '../../redux/actions/revisionActions';
import Footer from '../components/footer';

const Revision = (props) => {
  const { navigation, route, getRevisiones, getRevisionByPunto } = props
  const { acceso } = useContext(DataContext)
  const [terminoBuscador, setTerminoBuscador] = useState(undefined);
  const [data, setData] = useState([]);

  const [inicio, setInicio] = useState(0);
  const [limit, setLimit] = useState(10);
  const [final, setFinal] = useState(false);
  // const [revisiones, setRevisiones]= useState([])
  // const [revision_by_punto,, setRevision_by_punto]= useState([])

  useEffect(() => {
    console.log("Revision component mounted");
    console.log("Navigation object:", navigation);
    console.log("Route object:", route);
    console.log("Route params:", route?.params);
    loadRevisiones();
  }, []);


  const loadRevisiones = (last) => {
    const params = route?.params;
    console.log("loadRevisiones - params:", params);
    console.log("loadRevisiones - route:", route);
    if (params) {
      // getRevisionByPunto(params.puntoId)
      const url = `rev/revision/byPunto/${params.puntoId}`;
      console.log("URL enviada (por punto):", url);
      console.log("Parámetros:", { puntoId: params.puntoId });
      axios.get(url)
        .then(res => {
          console.log(res)
          setData(res.data.revision || [])
        })
        .catch(error => {
          console.error("Error cargando revisiones por punto:", error.message);
          setData([]);
        })
    } else {
      const limitParam = last || 10;
      const startParam = 0;
      const searchParam = terminoBuscador || 'undefined';
      const url = `rev/revision/${limitParam}/${startParam}/${searchParam}`;
      console.log("URL enviada:", url);
      console.log("Parámetros:", { limitParam, startParam, searchParam });
      axios.get(url)
        .then(res => {
          setData(res.data.revision || [])
        })
        .catch(error => {
          console.error("Error cargando revisiones:", error.message);
          setData([]);
        })
      // getRevisiones(0, last, terminoBuscador)
    }
  }
  const onScroll = (event) => {

    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;

    if (reachedEnd && !final) {


      setFinal(true);
      const newLimit = limit + 10;
      setLimit(newLimit);
      loadRevisiones(newLimit)
    } else if (!reachedEnd && final) {
      setFinal(false);
    }
  };


  const renderRevisiones = () => {
    const params = route?.params;

    if (!data || !Array.isArray(data)) {
      return <Text>No hay revisiones disponibles</Text>;
    }

    return data.map((e, key) => {
      return (
        <View style={[style.contenedorRevisiones, { backgroundColor: !e.activo ? "#F96D6C" : (e.estado == 2 || e.avisos || e.distancias || e.electricas || e.extintores || e.accesorios) ? "#e8a43d" : "white" }]} key={key}>
          {
            params
              ? <><TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate(acceso == "depTecnico" ? "cerrarRevision" : acceso == "insSeguridad" ? "cerrarSeguridad" : "nuevaRevision", { puntoId: params.puntoId, clienteId: params.clienteId, revisionId: e._id })}>
                <View style={{ width: "90%" }}>
                  <Text style={style.textUsers}>N Control: {e._id}</Text>
                  <Text style={style.textUsers}>Fecha:     {e.creado}</Text>


                  {e.estado == 2 && <Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                  {e.estado == 3 && <Text style={style.textUsers}>Solicitud cerrada</Text>}
                  {e.avisos && <Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                  {e.extintores && <Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                  {e.distancias && <Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                  {e.electricas && <Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                  {e.accesorios && <Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
                </View>
                <View style={{ justifyContent: "center" }}>
                  <FontAwesome name={'angle-right'} style={style.iconCerrar} />
                </View>
              </TouchableOpacity>
                {
                  acceso == "admin"
                  && <View style={[style.separador, { width: "100%" }]}></View>
                }
                {
                  acceso == "admin"
                  && <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("cerrarTanque", { tanqueId: e._id })}>
                    <Text>Cerrar Tanque <FontAwesome name='times-circle' style={style.iconCerrarTanque} /> </Text>
                  </TouchableOpacity>
                }
              </>
              : <>
                <TouchableOpacity style={{ flexDirection: "row" }}
                  onPress={() => navigation.navigate(acceso == "depTecnico" ? "cerrarRevision" : acceso == "insSeguridad" ? "cerrarSeguridad" : "nuevaRevision", { puntoId: e.puntoId && e.puntoId._id, clienteId: e.usuarioId && e.usuarioId._id, revisionId: e._id })}
                >
                  <View style={{ width: "90%" }}>
                    <Text style={style.textUsers}>N Control: {e._id}</Text>
                    <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                    {e.usuarioId && <Text style={style.textUsers}>{e.usuarioId.razon_social + " / " + e.usuarioId.codt}</Text>}
                    {e.puntoId && <Text style={style.textUsers}>{e.puntoId.direccion}</Text>}
                    {e.estado == 2 && <Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                    {e.estado == 3 && <Text style={style.textUsers}>Solicitud cerrada</Text>}
                    {e.avisos && <Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                    {e.extintores && <Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                    {e.distancias && <Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                    {e.electricas && <Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                    {e.accesorios && <Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <FontAwesome name={'angle-right'} style={style.iconCerrar} />
                  </View>
                </TouchableOpacity>
                {
                  acceso == "admin"
                  && <View style={[style.separador, { width: "100%" }]}></View>
                }
                {
                  acceso == "admin"
                  && <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("cerrarRevision", { puntoId: e.puntoId._id, clienteId: e.usuarioId._id, revisionId: e._id })}>
                    <Text>Cerrar Depto tecnico <FontAwesome name='times-circle' style={style.iconCerrarTanque} /> </Text>
                  </TouchableOpacity>
                }
                {
                  acceso == "admin"
                  && <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("cerrarSeguridad", { puntoId: e.puntoId._id, clienteId: e.usuarioId._id, revisionId: e._id })}>
                    <Text>Cerrar Seguridad <FontAwesome name='times-circle' style={style.iconCerrarTanque} /> </Text>
                  </TouchableOpacity>
                }
              </>
          }
        </View>
      )
    })
  }
  return (
    <View style={style.containerTanque}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="Buscar revision"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          onChangeText={(terminoBuscador) => setTerminoBuscador(terminoBuscador)}
          value={terminoBuscador}
          style={[style.inputCabezera]}
        />
      </View>

      <ScrollView style={{ marginBottom: 85 }} onScroll={(e) => onScroll(e)} keyboardDismissMode="on-drag">
        {
          renderRevisiones()
        }
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
          console.log("Parámetros disponibles:", params);
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

const mapState = (state) => {
  return {
    usuarios: state.usuario.usuarios,
    usuariosFiltro: state.usuario.usuarios,
    revisiones: state.revision.revisiones,
    revision_by_punto: state.revision.revision_by_punto,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getRevisiones: (start, limit, search) => {
      dispatch(getRevisiones(start, limit, search));
    },
    getRevisionByPunto: (idPunto) => {
      dispatch(getRevisionByPunto(idPunto));
    },
  };
};



export default connect(mapState, mapDispatch)(Revision);
