import styled from "styled-components"

////////////////////////////////////////////////////////
////////////////////////////////        MENU
////////////////////////////////////////////////////////
export const CabezeraContenedor = styled.header`
    /* position:fixed;
    height:100; */
    padding: 15px;
`
export const Listado = styled.li`
    background-color: #1890ff;
    border-color: #1890ff;
    padding: 16px;
    color: white;
    margin-bottom: 2px;
`
export const Boton = styled.span`
    color: white;
    position: relative;
    left: 10px;
    top: -5px;
`
export const LayoutCabezera3 = styled.div`
    width:5%;
    display:inline-table;
    text-align:right;
`
export const Logo = styled.img`
    width:50px;
`


////////////////////////////////////////////////////////
////////////////////////////////        SLIDER
////////////////////////////////////////////////////////
export const Slider = styled.section`
    width:100%;   
`
export const ContainerSlider = styled.div`
    width:25%;
    display: inline-table;
    margin: 10px 0;
`
export const Row1 = styled.div`
    width:5%;
    display: inline-table;
`
export const Row2 = styled.div`
    width:90%;
    display: inline-table;
`
 
export const ContainerLibroSlider = styled.div`
    width: 78%; 
    background-position:center;
    background-size: cover !important;
    text-align: center;
    @media only screen and (max-width:992px){
        width:90%;
        margin-left:5%
    }
`
 
export const TituloSlider = styled.p`
    width: 89%;
    padding: 4px 1px;
    color: #B3B2B2;  
    @media only screen and (max-width:992px){
        width: 100%;
        text-align: center;
    }
`
export const AutorSlider = styled.p`
    padding: 3px 1px;
    color: #B3B2B2;
    font-size: 15px;
    @media only screen and (max-width:992px){
        font-size: 14px;
        width: 100%;
        text-align: center;
        margin-bottom: 15px;
    }
`
export const Titulo = styled.h3`
    font-size: ${props => props.subTitulo ?`${props.subTitulo}px` :"25px"};
    color:#B8B8B8;
    margin:20px ${props => props.usuario ?0 :"50px"};  
`


////////////////////////////////////////////////////////
////////////////////////////////        USUARIO
////////////////////////////////////////////////////////  
export const ContenedorUsuario = styled.section`
    background: #f3f3f382;
    padding: 12px;
    border-radius: 6px;
`
export const Avatar = styled.img`
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width:100%;
`
export const TextoLibro = styled.p`
    color:#000000;
`
export const Innactivo = styled.p`
    color: #fff;
    background: red;
    padding: 10px;
    margin: 10px 0;
    width: 78%;
`
 