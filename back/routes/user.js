'use strict';
let fs = require('fs');
let moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')
let userServices       = require('./../services/userServices.js') 
let puntoServices      = require('./../services/puntoServices.js') 
const htmlTemplate     = require('../notificaciones/template-email.js')
let redis        = require('redis')
let cliente      = redis.createClient()

module.exports = function(app, passport){ 
    ///////////////////////////////////////////////////////////////////////////
    /*
    Guardar solo email
    */
    ///////////////////////////////////////////////////////////////////////////
    
    app.post('/x/v1/user/sign_up', (req, res)=>{
        let token = Math.floor(1000 + Math.random() * 9000);
        let tokens = token
        console.log("fer")
                    console.log(req.body)
        userServices.registro(req.body, (err, users)=>{
            let titulo = req.body.acceso=="cliente" 
                        ?`<font size="5">Verificación de Email</font>`
                        :`<font size="5">Nueva cuenta creada</font>`;
            let text1  = req.body.acceso=="cliente" 
                        ?`Hola Estimado/a: este es el codigo: ${token} para verificar su dirección de correo electrónico y completar el registro de su cuenta en Codegas`
                        :`Hola ${req.body.nombre} ya puede ingresar a su cuenta en la app de Codegas, sus datos de acceso son:`
            let text2  = req.body.acceso=="cliente" 
                        ?`` 
                        :`usuario: ${req.body.email}<br/>Contraseña: ${tokens}`
            let asunto = req.body.acceso=="cliente" ?"Nuevo codigo de verificación" :"Cuenta creada en Codegas"
            if (users) {
                if(users.activo){
                    /////////////////////////////////////////////
                    if(users.editado){
                        res.json({ status:false, message: 'este email ya existe', code:0 }) 
                    }else{
                        let user = users
                        req.session.usuario=user
                        res.json({ status:false, message: 'sin editar', code:3, users })
                    }
                    ////////////////////////////////////////////////////////////////////////   
                }else{
                    userServices.modificaToken(users, token, (err2, user)=>{
                        if(!err2){
                            htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
                            res.json({ status: true, message: 'nuevo codigo enviado', code:2, token });     
                        }
                    })       
                }
            }else{
                userServices.create(req.body, token, null, (err, user)=>{
                    
                    if(err){
                        return res.json({ err })
                    }else{
                        htmlTemplate(req, req.body, titulo, text1, text2, asunto)
                        
               
                        let userRegistrado = {email:"directora.comercial@codegascolombia.com, servicioalcliente@codegascolombia.com"}
                        htmlTemplate(req, userRegistrado, req.body.email, "Se ha registrado", "",  "Nuevo usuario")

                        res.json({ status:true, message: 'usuario registrado', user, code:2, token });     
                    }
                })  
            }  
        })
    })

    app.post("/x/v1/user/crea_varios", (req, res)=>{
        let token = Math.floor(1000 + Math.random() * 9000);
        let titulo = `<font size="5">Nueva cuenta creada</font>`;
       
        let text2  = ``                 
        let asunto =  "Cuenta creada en Codegas"
        
        req.body.clientes.map(e=>{
            let text1  = `Hola ${e.nombre}, ${req.body.nombrePadre} le ha creado  ya puede ingresar a tu cuenta en la app de Codegas para crear pedidos <br/> los datos de acceso son:<br/> usuario: ${e.email}<br/>Contraseña: ${token}`;
            userServices.create(e, token, req.body.idPadre, (err, user)=>{
                if(err){
                    return res.json({ err })
                }else{
                    htmlTemplate(req, e, titulo, text1, text2, asunto)
                    puntoServices.create(e, user._id, req.body.idPadre, (err2, punto)=>{

                    })
                }
            }) 
        })
        res.json({ status:true, message: 'usuarios registrados', code:2 });   
    })
    
    ///////////////////////////////////////////////////////////////////////////
    /*
    modificar usuarios
    */
    ///////////////////////////////////////////////////////////////////////////
    app.put('/x/v1/user/update_varios', (req, res)=>{
        if(!req.session.usuario){
            res.json({ status: false, message: 'Usuario Innactivo'}) 
        } else{
            req.body.clientes.map(e=>{
                 
                userServices.editVarios(e, e.idCliente, (err, user)=>{ 
                    
                })                 
            })
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    /*
    Verifica el token enviado
    */
    ///////////////////////////////////////////////////////////////////////////      
    app.post("/x/v1/user/verificaToken", (req, res)=>{
        userServices.verificaToken(req.body, (err, token)=>{
            if(err){
                res.json({status:false, mensaje:"TOKEN INVALIDO", code:0})
            } else{
               
                userServices.estadoUsuario(token, true, (err2, user)=>{
                    req.session.usuario=user
                    if (user) {
                        res.json({status:true, user, code:1})             
                    }
                })           
            }
        }) 
    })
    ///////////////////////////////////////////////////////////////////////////
    /*
    RECUPERAR CONTRASEÑA
    */
    ///////////////////////////////////////////////////////////////////////////    
    app.post('/x/v1/user/recover', (req,res)=>{
        let token = Math.floor(1000 + Math.random() * 9000);
        userServices.getEmail(req.body, (err, user)=>{
            if (err) {
                res.json({status:false, err, code:0 })
            }else{
                if(!user){
                    res.json({status:false, user: 'Usuario no existe', code:2 })
                }else{
                    console.log(user)
                    userServices.modificaToken(user, token, (err2, user)=>{
                        if(!err2){
                            let titulo = `<font size="5">Recuperar Contraseña</font>`
                             
                            let text1  = `Hola ${user.nombre} si desea recuperar su contraseña este es el codigo de recuperación: ${token}`
                            let text2  = `Este codigo tiene valides de 1 hora`
                            let asunto =  "Nuevo codigo de verificación"  
                                
                            htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
                            res.json({status: true, token, code:1})  
                        }
                    })   
                }
            }
        })
    });

    ///////////////////////////////////////////////////////////////////////////
    /*
    CAMBIAR LA CONTRASEÑA
    */
    ///////////////////////////////////////////////////////////////////////////      

    app.post("/x/v1/user/CambiarPassword", (req, res)=>{
        userServices.getEmail(req.body, (err, user)=>{   
            if(err){
                res.json({ status: 'FAIL', message:err, code:0})  
            }else{
                userServices.editPassword(user._id, req.body.password, (err, users)=>{
                    if(!err){
                        req.session.usuario=users
                        res.json({status:true, user, code:1})
                    }   
                })
            }
        })
    })

    
    ///////////////////////////////////////////////////////////////////////////
    ///////     LOGIN
    ///////////////////////////////////////////////////////////////////////////
    app.post('/x/v1/user/login', (req,res)=>{
        userServices.login(req.body, (err, user)=>{
            if (err) {
                res.json({status:false, err, code:0 })
            }else{
                if(user==null){
                    res.json({status:false, user: 'Usuario no existe', code:2 })
                }else{
                    if(user.validPassword(req.body.password)){
                        req.session.usuario = user
                        req.body.tokenPhone ?modificaTokenPhone(req, res)  :res.json({status:true, user, code:1})
                    }else{
                        res.json({status:false, user: 'Datos incorrectos', code:0 })
                    }     
                }
            }
        })
    });

    ///////////////////////////////////////////////////////////////////////////
    /*
    despues del login siempre modifico ==> tokenphone
    */
    ///////////////////////////////////////////////////////////////////////////
    const modificaTokenPhone = (req, res)=>{
      
        userServices.modificaTokenPhone(req.session.usuario._id, req.body.tokenPhone, (err, user)=>{
            if (err) {
                res.json({status:false, err, code:0})    
            }else{
                res.json({status:true, user, code:1})
            }
        })
    }


    ///////////////////////////////////////////////////////////////////////////
    /*
    si el login es exitoso
    */
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/user/perfil', function(req, res){
        
        if(req.session.usuario){
            const {usuario} = req.session
            puntoServices.getByUser(usuario._id, (err2, ubicaciones)=>{
                console.log({ubicaciones:ubicaciones})
                let nUbicaciones = ubicaciones.map(e=>{
                    let data = e.data[0] 
                    if(data.idCliente==usuario._id){
                        return {
                            direccion: data.direccion,
                            email: undefined,
                            idCliente: undefined,
                            idZona: data.idZona,
                            nombre: undefined,
                            nombreZona: data.nombreZona,
                            observacion: data.observacion,
                            activo: data.activo,
                            _id: data._id
                        }
                    }else{
                        return {
                            direccion: data.direccion,
                            email: data.email,
                            idCliente: data.idCliente,
                            idZona: data.idZona,
                            nombre: data.nombre,
                            nombreZona: data.nombreZona,
                            observacion: data.observacion,
                            activo: data.activo,
                            _id: data._id
                        }
                    }
                })
                 
                if (!err2) {
                    let user = {
                        _id:               usuario._id, 
                        razon_social:      usuario.idPadre==null ?usuario.razon_social :usuario.idPadre.razon_social,
                        cedula:            usuario.cedula, 
                        direccion:         usuario.direccion, 
                        email:             usuario.email, 
                        nombre:            usuario.nombre,
                        celular:           usuario.celular,
                        tipo:              usuario.tipo, 
                        acceso:            usuario.acceso, 
                        avatar:            usuario.avatar, 
                        codt:              usuario.codt, 
                        editado:           usuario.editado, 
                        direccion_factura: usuario.direccion_factura, 
                        codMagister:       usuario.codMagister, 
                        ubicaciones:       nUbicaciones
                    }
                    res.json({status:true, user})
                }else{
                    res.json({ status: false });	    
                }
            })
            
             
        }else{
            res.json({status:false, user: 'SIN SESION' }) 
        }    
    })

    ///////////////////////////////////////////////////////////////////////////
    /*
   obtiene la informacion de un usuario
    */
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/user/perfil/:idUser', function(req, res){
	    userServices.getById(req.params.idUser, (err, usuario)=>{
            if(err){
                res.json({ status: false, err });	
                console.log(err)
               
            }else{
                if(!usuario){
                    res.json({ status: false, err:"no existe usuario" });	
                }else{                
                    req.session.usuario=usuario
                    puntoServices.getByUser(usuario._id, (err2, ubicaciones)=>{
                        let nUbicaciones = ubicaciones.map(e=>{
                            let data = e.data[0] 
                            if(data.idCliente==usuario._id){
                                return {
                                    direccion: data.direccion,
                                    email: undefined,
                                    idCliente: undefined,
                                    idZona: data.idZona,
                                    nombre: undefined,
                                    capacidad:data.capacidad,
                                    nombreZona: data.nombreZona,
                                    observacion: data.observacion,
                                    _id: data._id
                                }
                            }else{
                                return {
                                    direccion: data.direccion,
                                    email: data.email,
                                    idCliente: data.idCliente,
                                    idZona: data.idZona,
                                    nombre: data.nombre,
                                    capacidad:data.capacidad,
                                    nombreZona: data.nombreZona,
                                    observacion: data.observacion,
                                    _id: data._id
                                }
                            }
                        })  
                        if (!err2) {
                            let user = {
                                _id:           usuario._id, 
                                razon_social:  usuario.razon_social,
                                cedula:        usuario.cedula, 
                                direccion:     usuario.direccion, 
                                email:         usuario.email, 
                                nombre:        usuario.nombre,
                                celular:       usuario.celular,
                                tipo:          usuario.tipo, 
                                acceso:        usuario.acceso, 
                                avatar:        usuario.avatar, 
                                codt:          usuario.codt, 
                                formularioChat:usuario.formularioChat, 
                                direccion_factura: usuario.direccion_factura, 
                                codMagister:       usuario.codMagister, 
                                ubicaciones:  nUbicaciones
                            }
                            res.json({status:true, user})
                        }else{
                            res.json({ status: false, err2 });
                            console.log(err2)	    
                        }
                    })
                }
            }
        })

        

       
    })

    ///////////////////////////////////////////////////////////////////////////
    /*
    modifica acceso y activa/desactiva
    */
    ///////////////////////////////////////////////////////////////////////////
    app.post('/x/v1/users/', function(req,res){
        if(req.session.usuario){
            if (req.session.usuario.acceso=='admin') {
                userServices.tipo(req.body, function(err, usuarios){
                    if(!err){
                        res.json({status:true, usuarios})
                    }else{
                        res.json({ status: 'FAIL', err}) 
                    }
                })
            }else{
                res.json({ status: 'FAIL', message:'No tienes acceso'})
            }
        }else{
            res.json({ status: 'FAIL', message:'usuario no logueado'})  
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    /*
    modificar usuarios
    */
    ///////////////////////////////////////////////////////////////////////////
    app.put('/x/v1/user/update/:idUsuario', (req, res)=>{
        if(!req.session.usuario){
            res.json({ status: false, message: 'Usuario Innactivo'}) 
        } else{
            userServices.edit(req.body, req.params.idUsuario, req.session.usuario.acceso, (err, user)=>{ 
                 
                if(!err){
                    userServices.getEmail(req.session.usuario, (err2, users)=>{    
                        if(!err2){
                            req.body.registro
                            &&userServices.getByAcceso("solucion", (err, usuarios)=>{
                               usuarios.map(e=>{
                                   let titulo = `<font size="5">el usuario: ${req.body.razon_social} se ha registrado</font>`
                                   let text1  = `ya puede editarlo en la app de codegas`
                                   let text2  = ``
                                   let asunto =  "Nuevo cliente creado"  
                                   htmlTemplate(req, e, titulo, text1, text2,  asunto)
                               })
                            })
                            req.body.puntos.map(e=>{
                                puntoServices.editar(e, e._id, (err2, puntos)=>{
                                    // console.log(puntos)
                                })
                            })
                            //////////////////////////////  ACTUALIZA LA SESION DEL USUARIO LOGUEADO
                            req.session.usuario=users

                            //////////////////////////////  SI ENVIA PASSWORD LO EDITA
                            req.body.password ?userServices.editPassword(req.params.idUsuario, req.body.password, (err, res)=>{}) :null
                                
                            //////////////////////////////  SI ENVIA UBICACIONES ELIMINADAS LAS DESACTIVA
                            req.body.ubicacionesEliminadas.length>0
                            ?eliminarUibicaciones(req, res) :res.json({ status: true, user: users, message: 'Usuario Editado'});
                           
                        }
                    })   
                }
            })                 
        }
    })
    const eliminarUibicaciones=(req, res)=>{
        req.body.ubicacionesEliminadas.map(e=>{
            puntoServices.desactivar(e, (err, res)=>{
                console.log(err)
                console.log(res)
            })
            res.json({ status: true,   message: 'Usuario Editado'});
        })
    }

    ///////////////////////////////////////////////////////////////////////////
    //////////      Actualizo el Avatar 
    ///////////////////////////////////////////////////////////////////////////
    app.post('/x/v1/user/avatar', function(req, res){
        if (!req.session.usuario) {
            res.json({ status:false, message: 'No hay un usuario logueado' }); 
        }else{
            let randonNumber = Math.floor(90000000 + Math.random() * 1000000)

            ////////////////////    ruta que se va a guardar en el folder
            let fullUrl = '../front/docs/public/uploads/avatar/'+fecha+'_'+randonNumber+'.jpg'

            ////////////////////    ruta que se va a guardar en la base de datos
            let ruta = req.protocol+'://'+req.get('Host') + '/public/uploads/avatar/'+fecha+'_'+randonNumber+'.jpg'

            ///////////////////     envio la imagen al nuevo path
            fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})
            console.log({ruta})
            ///////////////////    guardo la imagen
            let id = req.body.imagenOtroUsuario ?req.body.idUser :req.session.usuario._id
            userServices.avatar(id, ruta, function(err, avatar){
                if (!err) {
                    userServices.getEmail(avatar, (err2, user)=>{
                        if(!err2){
                            req.body.crear ?null :req.session.usuario=user /// esta linea crea la sesion cuando se edita el avatar, 
                            // ya que se puede crear un usuario desde el front, pero no necesito editar la sesion
                            res.json({ status:true, message: 'Avatar Actualizado', user });
                        }
                    })
                }else{
                    res.json({ status:false, message: err }); 
                }
            })
        }  
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      lista todos los usuarios
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/', (req,res)=>{
        if(req.session.usuario){
            if (req.session.usuario.acceso=='admin' || req.session.usuario.acceso=='solucion') {
                userServices.get((err, usuarios)=>{
                    if(!err){
                        usuarios = usuarios.filter(e=>{
                            return e.eliminado==false
                        })
                        let usuarios2 = usuarios.filter(e=>{
                            return e.acceso=="cliente"
                        })
                        usuarios2 = usuarios2.filter(e=>{
                            return e.idPadre==null
                        })
                        req.session.usuario.acceso=='admin' 
                        ?res.json({status:true, usuarios})
                        :res.json({status:true, usuarios:usuarios2})
                    }else{
                        res.json({ status: false, err}) 
                    }
                })
            }else if(req.session.usuario.acceso=='comercial'){
                userServices.get((err, usuarios)=>{
                    res.json({status:true, usuarios})
                })
            }else if(req.session.usuario.acceso=='veo'){
                userServices.get((err, usuarios)=>{
                    usuarios = usuarios.filter(e=>{
                        return e.comercialAsignado==req.session.usuario._id
                    })

                    res.json({status:true, usuarios})
                })
            }else{
                res.json({ status: false, message:'No tienes acceso', usuarios:[]})
            }
            
        }else{
            res.json({ status: false, message:'usuario no logueado'})  
        }
    })
    
    ///////////////////////////////////////////////////////////////////////////
    //////////////////      lista usuario por acceso
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/acceso/:acceso', (req,res)=>{
        if(req.session.usuario){
            userServices.getByAcceso(req.params.acceso, (err, usuarios)=>{
                if(!err){
                    res.json({status:true, usuarios})
                }else{
                    res.json({ status: 'FAIL', usuarios:[], err}) 
                }
            })
        }else{
            res.json({ status: 'FAIL', message:'usuario no logueado', usuarios:[]})  
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      lista clientes padres
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/clientes', (req,res)=>{
        if(req.session.usuario){
            if (req.session.usuario.acceso=='admin' || req.session.usuario.acceso=='solucion') {
                userServices.getByCliente((err, usuarios)=>{
                    if(!err){
                        usuarios = usuarios.filter(e=>{
                            return e.idPadre==null
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!==null
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!=="null"
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!=="undefined"
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!==""
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social
                        })
                        res.json({status:true, usuarios})
                    }else{
                        res.json({ status: 'FAIL', usuarios:[], err}) 
                    }
                })
            }else{
                userServices.getByVeos(req.session.usuario._id, (err, usuarios)=>{
                    console.log(req.session.usuario._id)
                    if(!err){
                        usuarios = usuarios.filter(e=>{
                            return e.idPadre==null
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!==null
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!=="null"
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!=="undefined"
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social!==""
                        })
                        usuarios = usuarios.filter(e=>{
                            return e.razon_social
                        })
                        res.json({status:true, usuarios})
                    }else{
                        res.json({ status: 'FAIL', usuarios:[], err}) 
                    }
                })
            }
        }else{
            res.json({ status: 'FAIL', message:'usuario no logueado', usuarios:[]})  
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      lista conductores sin vehiculos asignados
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/conductores/sinVehiculo', (req,res)=>{
        if(req.session.usuario){
            userServices.sinVehiculo(req.params.acceso, (err, usuarios)=>{
                if(!err){
                    res.json({status:true, usuarios})
                }else{
                    res.json({ status: 'FAIL', usuarios:[], err}) 
                }
            })
        }else{
            res.json({ status: 'FAIL', message:'usuario no logueado', usuarios:[]})  
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      lista usuario ADMIN Y SOLUCION
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/by/adminsolucion', (req,res)=>{
        userServices.getAdminSolucion((err, usuarios)=>{
            if(!err){  
                res.json({status:true, usuarios})
            }else{
                res.json({ status: 'FAIL', usuarios:[], err}) 
            }
        })
    })
    ///////////////////////////////////////////////////////////////////////////
    //////////////////      TRAE SOLO UN USUARIO
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/user/byId/:idUsuario', (req,res)=>{
        if(req.session.usuario){
            if (req.session.usuario.acceso=='admin' || req.session.usuario.acceso=='solucion' || req.session.usuario.acceso=='comercial'|| req.session.usuario.acceso=='veo') {
                userServices.getById(req.params.idUsuario, (err, usuario)=>{
                    puntoServices.getByUser(req.params.idUsuario, (err2, ubicaciones)=>{
                        let nUbicaciones = ubicaciones.map(e=>{
                            let data = e.data[0] 
                            return {
                                direccion: data.direccion,
                                email: data.email,
                                idCliente: data.idCliente,
                                idZona: data.idZona,
                                nombre: data.nombre,
                                capacidad:data.capacidad,
                                nombreZona: data.nombreZona,
                                observacion: data.observacion,
                                _id: data._id
                            }  
                        })  
                        if (!err2) {
                            let user = {
                                _id:          usuario._id, 
                                razon_social: usuario.razon_social,
                                cedula:       usuario.cedula, 
                                direccion:    usuario.direccion, 
                                email:        usuario.email, 
                                nombre:       usuario.nombre,
                                celular:      usuario.celular,
                                tipo:         usuario.tipo, 
                                activo:       usuario.activo, 
                                codt:         usuario.codt, 
                                direccion_factura:usuario.direccion_factura, 
                                acceso           : usuario.acceso, 
                                avatar           : usuario.avatar, 
                                ubicaciones      : nUbicaciones,
                                codMagister      : usuario.codMagister, 
                                veos             : usuario.comercialAsignado,
                            }
                            res.json({status:true, user})
                        }else{
                            res.json({ status: false, err2 });
                            console.log(err2)	    
                        }
                    })
                })
            }else{
                res.json({ status: false, message:'No tienes acceso'})
            }
        }else{
            res.json({ status: false, message:'usuario no logueado'})  
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      CAMBIA ESTADO USUARIO
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/cambiarEstado/:idUsuario/:estado', (req,res)=>{
        const {idUsuario, estado} = req.params
        console.log({idUsuario, estado})
        userServices.estadoUsuario(idUsuario, estado, (err, usuarios)=>{
            if(!err){  
                res.json({status:true, usuarios})
            }else{
                res.json({ status: false,  err}) 
            }
        })
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////////////     ELIMINA USUARIO
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/eliminar/:idUsuario', (req,res)=>{
        userServices.eliminarUsuario(req.params.idUsuario, (err, usuarios)=>{
            if(!err){  
                res.json({status:true, usuarios})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////     CAMBIA EL ESTADO DE FORMULARIO, PARA VER SI ES UN USUARIO NUEVA EN EL CHAT
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/formulario_chat/:tokenPhone/:estado', (req,res)=>{
        
        userServices.getByTokenPhone(req.params.tokenPhone, (err, usuarios)=>{
            if(usuarios){  
                res.json({status:true})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////     CAMBIA EL VALOR UNITARIO DE UN USUARIO
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/cambiarValor/:valor/:idUser', (req,res)=>{
        userServices.editarValorUnitario(req.params.valor, req.params.idUser, (err, usuarios)=>{
            if(usuarios){  
                res.json({status:true})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////     CAMBIA EL VALOR UNITARIO DEL PRODUCTO
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/cambiarValorTodos/:valor', (req,res)=>{
        userServices.get((err, usuarios)=>{
            if(!err){  
                usuarios.filter(e=>{
                    userServices.editarValorUnitario(req.params.valor, e._id, (err2, user)=>{
                        console.log(err2)
                    })
                })
                res.json({status:true})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })


    app.get('/x/v1/users/eliminar_usuario_entrando/:tokenPhone/:estado', (req,res)=>{
        let mensajeJson = {
            tokenPhone:req.params.tokenPhone, 
            activo:false
        }
         
        let mensajeBadge={
            badge:-1
        }	
        cliente.publish('nuevoChat', JSON.stringify(mensajeJson)) 
        cliente.publish('badgeConversacion', JSON.stringify(mensajeBadge)) 
        res.json({status:true})
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////     ASIGNAR COMERCIAL 
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/asignarComercial/:idUser/:idComercial', (req,res)=>{
        userServices.asignarComercial(req.params.idUser, req.params.idComercial, (err, usuario)=>{
            if(!err){  
                res.json({status:true, usuario})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////     editar campos 
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/editar_campos/', (req,res)=>{
        userServices.getByCliente( (err, usuarios)=>{
            if(!err){  
                 usuarios.filter(e=>{
                    
                    // userServices.editarCampo(e._id, e.comercial, (err)=>{
                         
                    // })
                    // let idZona = e.idZona1 
                    // idZona = idZona.replace(/[')]+/g, '')
                    // idZona = idZona.substring(9)
                    let data = {direccion:e.direccion, capacidad: e.capacidad, idZona:e.zona__1}
                    // console.log(data)
                    puntoServices.create(data, e._id, e._id, (err2, puntos)=>{
                        
                    })

                })
                res.json({status:true, usuarios})
            }else{
                res.json({ status: false, err}) 
            }
        })
    })
    //mongoimport --db codegas --collection users --file clientes2.json --jsonArray

    ///////////////////////////////////////////////////////////////////////////
    //////////////////      TOMATELA TE DIGO
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/by/asefsfxf323-dxc/:kldfjlxkfe', (req,res)=>{
        if(req.session.usuario){
            if (req.session.usuario.acceso=='admin') {
                userServices.getById(req.params.kldfjlxkfe, (err, users)=>{
                    if(!err){
                        console.log(users)
                        req.session.usuario=users
                        res.json({status:true, users})
                    }else{
                        res.json({ status:false, err}) 
                    }
                })
            }else{
                res.json({ status: false, message:'No tienes acceso'})
            }
        }else{
            res.json({ status: false, message:'usuario no logueado'})  
        }
    })



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/x/v1/user/logout', function(req, res) {
        req.session.usuario = null
        res.json({ status:true, code:1 }); 
    });

    
         
}