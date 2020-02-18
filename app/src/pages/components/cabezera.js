import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native'
import Icon from 'react-native-fa-icons' 
import {style} from './style'
import {connect}   from 'react-redux' 
 
 
class CabezeraComponent extends Component{
	constructor(props) {
		super(props);
		this.state={
			terminoBuscador:""
		}
	}
	render(){
		const { terminoBuscador } = this.state;
		const { showFilter } = this.props;
		return (
			<View style={style.cabezera}>
				{
					showFilter
					?<View style={{flexDirection:"row"}}>
						<View style={[style.subCabezera, style.subCabezeraBuscador]}>
							<TextInput
								placeholder="Buscar por: título, autor, isbn"
								onChangeText={(terminoBuscador)=> {this.props.keyword(terminoBuscador); this.setState({ terminoBuscador: terminoBuscador })}}
								value={terminoBuscador}
								style={style.inputCabezera}
							/>
							{
								terminoBuscador.length<1
								?<View style={style.btnIconSearch}>
									<Icon name={'search'} allowFontScaling style={style.iconSearch} />
								</View>
								:<TouchableOpacity onPress={()=>{this.props.keyword(""); this.setState({ terminoBuscador: "" })}} style={style.btnIconSearch}>
									<Icon name={'close'} allowFontScaling style={style.iconSearch} />
								</TouchableOpacity>
							}
						</View>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>this.props.showFiltro()}>
							<Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
						</TouchableOpacity>
					</View>
					:<View style={style.subCabezera}>
						<TextInput
							placeholder="Buscar por: título, autor, isbn"
							onChangeText={(terminoBuscador)=> {this.props.keyword(terminoBuscador); this.setState({ terminoBuscador: terminoBuscador })}}
							value={terminoBuscador}
							style={style.inputCabezera}
						/>
						{
							terminoBuscador.length<1
							?<View style={style.btnIconSearch}>
								<Icon name={'search'} allowFontScaling style={style.iconSearch} />
							</View>
							:<TouchableOpacity onPress={()=>{this.props.keyword(""); this.setState({ terminoBuscador: "" })}} style={style.btnIconSearch}>
								<Icon name={'close'} allowFontScaling style={style.iconSearch} />
							</TouchableOpacity>
						}
						
						 
					</View>
				}
				
			</View>	 
	    )
	}	 
}

const mapStatetoPros =(state) =>{
	return{
		carrito:state.carrito
	}
}
	   
export default connect(mapStatetoPros)(CabezeraComponent) 
