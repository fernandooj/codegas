import React, {Component} from 'react'
import {View, Text, Dimensions, Animated} from 'react-native'
import {getPedidoByUser} from '../../redux/actions/pedidoActions' 
import { connect }  from "react-redux";
import Footer       from '../components/footer'
import { BarChart}  from "react-native-chart-kit";
import {DataContext} from "../../context/context"
import {getPedidosChart} from '../../redux/actions/pedidoActions' 
import {style}      from './style'
 
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
    static contextType = DataContext;
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
        pedidos:[],
        top:new Animated.Value(size.height),
	  }
    }
    
    componentWillMount = async () =>{
        const value = this.context;
        const {acceso, userId} = value
        console.log(acceso)
        try {
            let userId = acceso=="cliente" ?idUsuario :this.props.navigation.state.params.idUsuario
            // let userId = "5e3d805e4ceec44739a42f40"
            console.log({userId})
            this.props.getPedidosChart(userId)
        } catch (error) {
            console.log(error)
        }
        
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
            data.push({date:e.fechaentrega, count:parseInt(e.kilos)})
        })
        let datos = groupBy(data, month)
        datos.map(e=>{
            fechas.push(e.date)
        })
        datos.map(e=>{
            total.push(e.count)
        })
        this.setState({fechas, total, pedidos})
        console.log({fechas, total, pedidos})
    }
    renderChat(){
        let {total, fechas} = this.state
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
                fromZero={true}
                verticalLabelRotation={30}
                width={size.width} // from react-native
                height={size.height-130}
                yAxisLabel=" "
                yAxisSuffix=" Kilos"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#002587",
                fillShadowGradientOpacity:1,    
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 0) => `rgba(255, 204, 0, ${opacity})`,
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
        const {pedidos}    = this.state
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Graficos ultimos 6 meses, pedidos: {pedidos.length}</Text>
                    {
                        pedidos.length==0
                        ?<Text style={style.textNoEntregados}>No tiene pedidos entregados</Text>
                        :this.renderChat()
                    }
                <Footer navigation={navigation} />
            </View>
        )
    }
}

const mapState = state => {
    console.log("state.pedido")
    console.log(state.pedido)
	return {
        pedidos: state.pedido.pedidosChart,
	};
};

const mapDispatch = dispatch => {
    return {
        getPedidosChart: (idUser) => {
            dispatch(getPedidosChart(idUser));
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
