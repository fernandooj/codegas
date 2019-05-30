'use strict';
/////////////////////////////////////////////////////////////////////////
/***** librerias necesarias para el funcionamiento de la app  **********/
/////////////////////////////////////////////////////////////////////////
let express      = require('express') 
let app          = express();
let bodyParser   = require('body-parser');
let morgan       = require('morgan');
let mongoose     = require('mongoose');
let cookieParser = require('cookie-parser');
let cookieSession= require('cookie-session');
let formidable   = require('express-form-data');
const fileUpload = require('express-fileupload');
let fs = require('fs');

// importo las rutas
let conversacionRutas = require('./routes/conversacion.js');
let mensajeRutas      = require('./routes/mensaje.js');
let pedidoRutas       = require('./routes/pedido.js');
let novedadRutas      = require('./routes/novedad.js');
let carroRutas        = require('./routes/carro.js');

let SocketIO = require('./socket.js')
const path   = require('path');

let https = require('http')
var options = {
  // cert: fs.readFileSync('/home/certificados/bundle.crt', 'utf8'),
  // key: fs.readFileSync('/home/certificados/releo.co.pem', 'utf8')
};
let server = https.Server(options, app)
SocketIO(server)
//let mongoStore   = require('connect-mongo')(session)
/////////////////////////////////////////////////////////////////////////
/***** librerias necesarias para el login con facebook | google  *******/
/////////////////////////////////////////////////////////////////////////   
let passport = require('passport');
let flash    = require('connect-flash');


/////////////////////////////////////////////////////////////////////////
/***** puerto donde va a funcionar el servidor por defecto 3030  *******/
/////////////////////////////////////////////////////////////////////////
let port = process.env.port || 8080;





/////////////////////////////////////////////////////////////////////////
/********* importo el archivo de configuracion de passport   ***********/
/////////////////////////////////////////////////////////////////////////
require('./config/passport')(passport); // pass passport for configuration


    


// da acceso para los servicios
mongoose.Promise = global.Promise;
let config = require('./config/config.js');
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,  x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
};
 
//llamo al archivo de configuracion
mongoose.connect(config.database, { useMongoClient: true })

// llamo a los archivos estaticos
app.get('/:url', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/docs/index.html'));
});
app.get('/:url/:url', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/docs/index.html'));
});

app.use(express.static('../front/docs'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(morgan('dev'));
app.use(allowCrossDomain);



// variables que guardan la sesion
app.use(cookieSession({ 
  name: 'ipuc',
  keys: ['key1', 'key2'],
})); /// session secret

app.use(formidable.parse({ keepExtensions:true }))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 


 


// creo la ruta de las categorias
app.use('/x/v1/con/conversacion', conversacionRutas) 
app.use('/x/v1/men/mensaje',      mensajeRutas) 
app.use('/x/v1/ped/pedido',       pedidoRutas) 
app.use('/x/v1/nov/novedad',      novedadRutas) 
app.use('/x/v1/veh/vehiculo',        carroRutas) 
require('./routes/User.js')(app, passport);

server.listen(port)
console.log("run in: " + port)