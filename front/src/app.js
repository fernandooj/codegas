import React         from "react"
import MainRoutes    from "./routes/MainRoutes"
import {GlobalStyle} from "./GlobalStyles"
import Cabezera      from './pages/components/cabezera'
import createHashSource from 'hash-source'
import {createHistory,LocationProvider} from "@reach/router";
// import ReactGA from 'react-ga';
// ReactGA.initialize('UA-104957049-1', {
//     gaOptions: {
//       userId: localStorage.getItem("userId"),
//       nombre: localStorage.getItem("userName")
//     }
// });

let source = createHashSource()
let history = createHistory(source)
 
export const App =()=>(
    <LocationProvider history={history}>
        <GlobalStyle />
        <Cabezera />
        <MainRoutes />
    </LocationProvider>
)