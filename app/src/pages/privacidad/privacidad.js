import React, { Component }        from 'react'
import {  Text,  StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
 
 
 
 
//////////////////////////////////////////////////////////////////////////////////////////
//////  CREO EL COMPONENTE 
//////////////////////////////////////////////////////////////////////////////////////////
export default class Privacidad extends Component<{}> {
  constructor(){
    super();
    this.state={
      connection_Status : ""
    }
  }
 
  render(){
    return (
        <ScrollView style={style.contenedor}>
            <Text style={style.titulo}>
                AVISO DE PRIVACIDAD Y AUTORIZACION EXPRESA PARA EL TRATAMIENTO DE DATOS PERSONALES
            </Text>
            <Text style={style.subTitulo}>
                La Compañía de Servicios Públicos S.A E.S.P. en cumplimiento a la ley 1581 de 2012, el Decreto
                Reglamentario 1377 de 2013, el Decreto Reglamento 886 de 2014 y nuestra política de privacidad,
                tratamiento y protección de datos personales, informa que los datos personales(incluyendo datos
                sensibles)suministrados en virtud de la vinculación, desempeño de funciones o prestación de servicios,
                retiro o terminación dependiendo del tipo de relación jurídica y las actividades o relaciones que contraiga
                con la empresa, serán tratados mediante el uso y mantenimiento de medidas de seguridad técnicas,
                humanas, físicas, administrativas y legales necesarias para otorgar seguridad a los registros evitando su
                adulteración, perdida, consulta, uso o acceso no autorizado o fraudulento.
                Además, Compañía de Servicios Públicos S.A E.S.P, actuará como responsable de tratamiento de datos
                personales del titular, los cuales podrá obtener y usar en actividades de operación, registro, afiliación,
                atender o formalizar cualquier tipo de trámite que el titular solicite o requiera, además transferirlos
                internamente o a terceros, actualizarlos, suprimirlos y almacenarlos.
                Es importante que como titular conozca que tiene derechos legales especialmente el derecho a conocer,
                actualizar, rectificar y suprimir su información personal, también a revocar el consentimiento otorgado a
                través de la firma de esta autorización. Estos derechos pueden ser ejercidos mediante los acanales
                establecidos: 1. E-mail dirigido a pqr@codegascolombia.com. 2. telefónicamente al 5522261. 3.
                directamente a la oficina de Jurídica ubicado en el Kilómetro 1.8 via Madrid Puente Piedra, en MadridCundinamarca.
                Teniendo en cuenta lo anterior, autorizo de manera voluntaria, previa, explicita, informada e inequívoca a la
                Compañía de Servicios Públicos S.A E.S.P, para tratar mis datos personales de acuerdo con su política de
                tratamiento de datos personales para fines relacionados con su objeto y en especial para fines legales,
                contractuales y misionales.
                Con las mismas condiciones autorizo a la compañía de Servicios Públicos S.A E.S.P, para consultar ante
                cualquier entidad de información o en base de datos de la información y referencias que he declarado o que
                se requieran para prevenir y auto controlar el Lavado de Activos y la Financiación del Terrorismo como
                persona natural o de la persona jurídica que represento.
            </Text>
            <TouchableOpacity style={style.aceptoTerminosBtn} onPress={()=>this.props.navigation.navigate("registro")}>
                <Text style={style.textAcepto}>Acepto los terminos</Text>
            </TouchableOpacity>
        </ScrollView>
    )
  }
}

const style = StyleSheet.create({
    contenedor: {
        flex:1,
        paddingHorizontal:20,
        marginVertical:20
    },
    titulo:{
        fontFamily: "Comfortaa-Bold",
        fontSize:18,
        marginVertical:20
    },
    subTitulo:{
        fontFamily: "Comfortaa-Regular",
        textAlign:"justify",
        fontSize:15,
    },
    aceptoTerminosBtn:{
        alignItems:"center",
        backgroundColor:"#ffcc00",
		padding:10,
        borderRadius:5,
        marginVertical:10
    },
    textAcepto:{
        fontFamily: "Comfortaa-Regular",
        color:"#ffffff",
    }

}); 