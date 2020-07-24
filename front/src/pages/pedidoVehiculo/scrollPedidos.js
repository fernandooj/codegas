import React, { PureComponent } from "react";
 
import { Popover } from 'antd'; 
import 'antd/dist/antd.css';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  COMPONENTE QUE VUELVE DRAGABLE LA LISTA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var placeholder = document.createElement("li");
placeholder.className = "placeholder";
export default class List extends React.Component {
    constructor(props) {
      super(props);
    //   this.state = {...props};
      this.state ={
        pedidos:[]
      };
      console.log(this.props.pedidos)
    }
    componentWillMount(){
        
        let pedidos = this.props.pedidos.sort((a, b)=>{
            return a.info[0].orden - b.info[0].orden;
        });
        this.setState({pedidos})
    }
    dragStart(e) {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.dragged);
    }
    dragEnd(e) {
      this.dragged.style.display = 'inline-block';
      this.dragged.parentNode.removeChild(placeholder);
      
      // update state
      var data = this.state.pedidos;
      var from = Number(this.dragged.dataset.id);
      var to = Number(this.over.dataset.id);
      if(from < to) to--;
      data.splice(to, 0, data.splice(from, 1)[0]);
      this.setState({pedidos: data});
      this.props.ordenPedidos(data)
    }
    dragOver(e) {
      e.preventDefault();
      this.dragged.style.display = "inline-block";
      if(e.target.className === 'placeholder') return;
      this.over = e.target;
      e.target.parentNode.insertBefore(placeholder, e.target);
    }
      render() {
      let {pedidos} = this.state
      
      let listItems = pedidos.map((item, i) => {
      let {_id, entregado, forma, cantidadKl, cantidadPrecio, cliente, direccion, orden, orden_cerrado, estado, nPedido, razon_social} = item.info[0]
        return (
          <li 
            style={
                entregado && estado=="activo"
                ?{backgroundColor:"#5cb85c", color:"#ffffff"} 
                :entregado && estado=="noentregado"
                ?{backgroundColor:"#ffffff", color:"#000000"} 
                :{backgroundColor:"#f0ad4e", color:"#ffffff"}
            }
            data-id={i}
            key={i}
            draggable='true'
            onDragEnd={this.dragEnd.bind(this)}
            onDragStart={this.dragStart.bind(this)}>
              {
                orden_cerrado !=orden &&entregado
                &&<Popover title={`Orden no coincide, asignado: ${orden} - puesto: ${orden_cerrado}`}>
                  {/* <i className="fa fa-exclamation-circle" aria-hidden="true"></i> */}
                </Popover>
              }
              
              {nPedido}<br/>
              {/* {orden}<br/> */}
              {entregado ?"Entregado" :"En ruta"}<br/>
              {forma}
              {forma=="cantidad" ?cantidadKl+" Kl" :forma=="monto" ?" $"+cantidadPrecio :" "}<br/>
              {razon_social}<br/>
              {direccion}<br/>
          </li>
        )
      });
          return (
            <ul onDragOver={this.dragOver.bind(this)}>
                {listItems}
            </ul>
          )
      }
  }