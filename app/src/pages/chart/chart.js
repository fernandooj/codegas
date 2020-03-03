import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
 
import {getPedidos} from '../../redux/actions/pedidoActions' 
 
import { connect }         from "react-redux";
import Footer              from '../components/footer'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

import {style}             from './style'
 
function groupBy(array, groupFn) {
    var hash = Object.create(null),
        result = [];

    array.forEach(function (o) {
        var key = groupFn(o);
        if (!hash[key]) {
            hash[key] = { date: key, count: 0 };
            result.push(hash[key]);
        }
        hash[key].count += o.count;
    });
    return result;
}

month = function (o) { return o.date.slice(0, 7) ; },
week = function (o) {
    var d = new Date(o.date),
        day = 1000 * 60 * 60 * 24,
        offset = 4 * day;

    d.setTime(Math.floor((d.valueOf() - offset) / 7 / day) * 7 * day + offset);
    return d.toISOString().slice(0, 10);
};

let size  = Dimensions.get('window');
class Chart extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        placa:"",
        centroEditar:"",
        bodegaEditar:"",
        modalConductor:false,
        modalEditar:false,
        conductores:[],
        fechas:[],
        total:[],
        top:new Animated.Value(size.height),
	  }
	}
    componentWillMount(){
        this.props.getPedidos()
        
    }
    componentWillReceiveProps(props){
        let data   = []
        let fechas = []
        let total  = []
        
        let pedidos = props.pedidos.filter(e=>{
            return e.kilos
        })
        pedidos.filter(e=>{
            e.kilos=e.kilos.replace(',', '.')
            return e
        })
        pedidos.map(e=>{
            data.push({date:e.fechaEntrega, count:parseInt(e.valor_unitario)*parseInt(e.kilos)})
        })
        let datos = groupBy(data, month)
        datos.map(e=>{
            fechas.push(e.date)
        })
        datos.map(e=>{
            total.push(e.count)
        })
        this.setState({fechas, total})
    }
    renderChat(){
        let {total, fechas} = this.state
        console.log({total, fechas})
        
        return(
            <BarChart
                data={{
                    labels: fechas,
                    datasets: [
                        {
                            data: total
                        }
                    ]
                }}
                paddingLeft="150"
                verticalLabelRotation={30}
                width={size.width} // from react-native
                height={size.height-130}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#002587",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "10",
                    strokeWidth: "5",
                    stroke: "#ffffff"
                }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 10,
                    paddingRight:100
                }}
            />
        )
    }
	render(){
        const {navigation} = this.props
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Graficos ultimos 6 meses</Text>
                    {this.renderChat()}
                <Footer navigation={navigation} />
            </View>
        )
    }
}

const mapState = state => {
	return {
        pedidos: state.pedido.pedidos,
	};
};

const mapDispatch = dispatch => {
    return {
        getPedidos: (fechaEntrega) => {
            dispatch(getPedidos(fechaEntrega));
        },
    };
};

Chart.defaultProps = {
    pedidos:[],
 
};

Chart.propTypes = {

};

  export default connect(
	mapState,
	mapDispatch
  )(Chart);
