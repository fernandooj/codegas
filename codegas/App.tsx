import Home from "./src/pages/home"
import {Provider} from 'react-redux';
import configStore from './src/redux/store.js'
const store = configStore();

function App(): JSX.Element {
  return <Provider store={store}>
    <Home />
    </Provider>
}
export default App