import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { style } from './style';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { DataContext } from '../../context/context';
import { getRevisiones, getRevisionByPunto } from '../../redux/actions/revisionActions';
import Footer from '../components/footer';

const Revision = (props) => {
  const {revisiones=[], revision_by_punto=[], navigation, getRevisiones, getRevisionByPunto} = props
  const {acceso} = useContext(DataContext)
  const [terminoBuscador, setTerminoBuscador] = useState(undefined);
  const [data, setData] = useState(navigation.state.params ? revision_by_punto : revisiones);
  console.log("revisiones")
  console.log(data)
 
  const [inicio, setInicio] = useState(0);
  const [limit, setLimit] = useState(10);
  const [final, setFinal] = useState(false);

  useEffect(() => {
    loadRevisiones()
  }, [loadRevisiones]);

  const loadRevisiones =(last) => {
    if (navigation.state.params) {
      getRevisionByPunto(navigation.state.params.puntoId)
    } else {
      getRevisiones(0, last, terminoBuscador)
    }
  }
  const onScroll = (event) => {
 
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;
    
    if (reachedEnd && !final) {
     
    
      setFinal(true);
      setLimit(limit+10);
      loadRevisiones(limit)
    } else if (!reachedEnd && final) {
      setFinal(false);
    }
  };

   
  const renderRevisiones = ()=>{

    return data.map((e, key)=>{
      return(
        <View style={[style.contenedorRevisiones, {backgroundColor: !e.activo ?"#F96D6C" :(e.estado==2 ||e.avisos||e.distancias||e.electricas||e.extintores||e.accesorios) ?"#e8a43d" :"white" }]} key={key}>
          {
            navigation.state.params
            ?<><TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate(acceso=="depTecnico" ?"cerrarRevision" :acceso=="insSeguridad" ?"cerrarSeguridad" :"nuevaRevision", {puntoId:navigation.state.params.puntoId, clienteId:navigation.state.params.clienteId, revisionId:e._id})}>
                <View style={{width:"90%"}}>
                  <Text style={style.textUsers}>N Control: {e.nControl}</Text>
                  <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                
                  
                  {e.estado==2  &&<Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                  {e.estado==3  &&<Text style={style.textUsers}>Solicitud cerrada</Text>}
                  {e.avisos     &&<Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                  {e.extintores &&<Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                  {e.distancias &&<Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                  {e.electricas &&<Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                  {e.accesorios &&<Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
                </View>
                <View  style={{justifyContent:"center"}}>
                    <Icon name={'angle-right'} style={style.iconCerrar} />
                </View>
            </TouchableOpacity>
                {
            acceso=="admin"
            &&<View style={[style.separador, {width:"100%"}]}></View>
            }
            {
              acceso=="admin"
              &&<TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("cerrarTanque", {tanqueId:e._id})}>
              <Text>Cerrar Tanque <Icon name='times-circle' style={style.iconCerrarTanque} /> </Text>
              </TouchableOpacity>
            }
            </>
            :<>
              <TouchableOpacity style={{flexDirection:"row"}}
              onPress={()=>navigation.navigate(acceso=="depTecnico" ?"cerrarRevision" :acceso=="insSeguridad" ?"cerrarSeguridad" :"nuevaRevision", {puntoId:e.puntoId &&e.puntoId._id, clienteId:e.usuarioId &&e.usuarioId._id, revisionId:e._id})}
              >
                <View style={{width:"90%"}}>
                <Text style={style.textUsers}>N Control: {e.nControl}</Text>
                <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                {e.usuarioId &&<Text style={style.textUsers}>{e.usuarioId.razon_social+" / "+e.usuarioId.codt}</Text>}
                {e.puntoId &&<Text style={style.textUsers}>{e.puntoId.direccion}</Text>}
                {e.estado==2  &&<Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                {e.estado==3  &&<Text style={style.textUsers}>Solicitud cerrada</Text>}
                {e.avisos     &&<Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                {e.extintores &&<Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                {e.distancias &&<Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                {e.electricas &&<Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                {e.accesorios &&<Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
              </View>
              <View  style={{justifyContent:"center"}}>
                  <Icon name={'angle-right'} style={style.iconCerrar} />
              </View>
            </TouchableOpacity>
              {
                acceso=="admin"
                &&<View style={[style.separador, {width:"100%"}]}></View>
              }
              {
                acceso=="admin"
                &&<TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("cerrarRevision", {puntoId:e.puntoId._id, clienteId:e.usuarioId._id, revisionId:e._id})}>
                  <Text>Cerrar Depto tecnico <Icon name='times-circle' style={style.iconCerrarTanque} /> </Text>
                </TouchableOpacity>
              }
              {
                acceso=="admin"
                &&<TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("cerrarSeguridad", {puntoId:e.puntoId._id, clienteId:e.usuarioId._id, revisionId:e._id})}>
                    <Text>Cerrar Seguridad <Icon name='times-circle' style={style.iconCerrarTanque} /> </Text>
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
        {navigation.state.params && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('nuevaRevision', {
                puntoId: navigation.state.params.puntoId,
                clienteId: navigation.state.params.clienteId,
                direccion: navigation.state.params.direccion,
                capacidad: navigation.state.params.capacidad,
                observacion: navigation.state.params.observacion,
              })
            }
          >
            <Icon name="plus" style={style.iconAdd} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ marginBottom: 85 }} onScroll={(e) => onScroll(e)} keyboardDismissMode="on-drag">
        {
          renderRevisiones()
        }
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const mapState = (state) => {
  console.log("state.revision.revision_by_punto")
  console.log(state.revision.revision_by_punto)
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
