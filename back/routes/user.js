'use strict';
let fs = require('fs');
let  moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')
 
let userServices = require('./../services/userServices.js') 
const htmlTemplate = require('../template-email.js')
 

module.exports = function(app, passport){ 
    ///////////////////////////////////////////////////////////////////////////
    /*
    Guardar solo email
    */
    ///////////////////////////////////////////////////////////////////////////
    
    app.post('/x/v1/user/sign_up', function(req, res){
        let token = Math.floor(1000 + Math.random() * 9000);
        let tokens = token
        userServices.getEmail(req.body, (err, users)=>{
            let titulo = req.body.acceso=="cliente" 
                        ?`<font size="5">Verificación de Email</font>`
                        :`<font size="5">Nueva cuenta creada</font>`;
            let text1  = req.body.acceso=="cliente" 
                        ?`Hola Estimado/a: Usa el codigo: ${token} para verificar tu dirección de correo electrónico y completar el registro de tu cuenta en Codegas`
                        :`Hola ${req.body.nombre} ya puedes ingresar a tu cuenta en la app de Codegas, tus datos de acceso son:`
            let text2  = req.body.acceso=="cliente" 
                        ?`Este vínculo caducará en 24 horas. Si ha caducado, pruebe a solicitar un nuevo correo electrónico de verificación.` 
                        :`usuario: ${req.body.email}<br/>Contraseña: ${tokens}`
            let asunto = req.body.acceso=="cliente" ?"Nuevo codigo de verificación" :"Cuenta creada en Codegas"
            if (users) {
                if(users.activo){
                    res.json({ status:false, message: 'este email ya existe', code:0 });            
                }else{
                    userServices.modificaToken(users, token, (err2, user)=>{
                        if(!err2){
                            htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
                            res.json({ status: true, message: 'nuevo codigo enviado', code:2, token });     
                        }
                    })       
                }
            }else{
                userServices.create(req.body, token, (err, user)=>{
                    if(err){
                        return res.json({ err })
                    }else{
                        htmlTemplate(req, req.body, titulo, text1, text2, asunto)
                        res.json({ status:true, message: 'usuario registrado', user, code:2, token });     
                    }
                })  
            }  
        })
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
                console.log(token)
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
                res.json({status:'FAIL', user: 'Usuario no existe', code:2 })
            }else{
                userServices.modificaToken(user, token, (err2, user)=>{
                    if(!err2){
                        let text1 = `<font size="5">Si solicitaste cambiar tu contraseña, inserta este codigo </h2>`;
                        let boton = `completar_perfil`;
                        let text2 = "de lo contrario has caso omiso a este mensaje";
                        let url1  = `x/v1/user/token?username=${user.username}&token=${user.token}`
                            
                        htmlTemplate(req, user, text1, boton, text2, url1, "Cambio contraseña", token)
                        res.json({status: 'SUCCESS', token, code:1})  
                    }
                })   
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
                        res.json({status:'SUCCESS', user, code:1})
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
                        modificaTokenPhone(req, res)  
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
        console.log(req.session.usuario)
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
            let user = {
                _id:          usuario._id, 
                razon_social: usuario.razon_social,
                cedula:       usuario.cedula, 
                direccion:    usuario.direccion, 
                email:        usuario.email, 
                nombre:       usuario.nombre,
                celular:      usuario.celular,
                tipo:         usuario.tipo, 
                acceso:       usuario.acceso, 
            }
            res.json({status:true, user})
             
        }else{
            res.json({status:false, user: 'SIN SESION' }) 
        }    
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
                        res.json({status:'SUCCESS', usuarios})
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
    app.put('/x/v1/user/update', function(req, res){
        if(!req.session.usuario){
            res.json({ status: false, message: 'Usuario Innactivo'}) 
        } else{
           
            userServices.edit(req.body, req.session.usuario._id, (err, user)=>{ 
                if(!err){
                    console.log(err)
                    userServices.getEmail(user, (err2, users)=>{    
                        if(!users.avatar){
                            let random = Math.round(Math.random()*3);
                            let avatar = req.protocol+'://'+req.get('Host')+"/uploads/avatar/avatar"+random+".png"
                            users["avatar"] = avatar
                            userServices.avatar(req.session.usuario._id, avatar, function(err, avatar){
                                if (!err) {
                                    req.session.usuario=users
                                    res.json({ status: true, message: 'Avatar Actualizado', avatar }); 
                                }else{
                                    res.json({ status: false, message: err }); 
                                }
                            })
                        }else{
                            req.session.usuario=users
                            res.json({ status: true, message: 'Usuario Activado'});
                        }
                    })   
                }
                
            })                 
        }
    })

    ///////////////////////////////////////////////////////////////////////////
    //////////      Actualizo el Avatar 
    ///////////////////////////////////////////////////////////////////////////
    app.post('/x/v1/user/avatar', function(req, res){
        if (!req.session.usuario) {
            res.json({ status:false, message: 'No hay un usuario logueado' }); 
        }else{
            let randonNumber = Math.floor(90000000 + Math.random() * 1000000)

            ////////////////////    ruta que se va a guardar en el folder
            let fullUrl = '../front/docs/uploads/avatar/'+fecha+'_'+randonNumber+'.jpg'

            ////////////////////    ruta que se va a guardar en la base de datos
            let ruta = req.protocol+'://'+req.get('Host') + '/uploads/avatar/'+fecha+'_'+randonNumber+'.jpg'

            ///////////////////     envio la imagen al nuevo path
            fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})
            
            ///////////////////    guardo la imagen
            let id = req.body.imagenOtroUsuario ?req.body.idUser :req.session.usuario._id
            userServices.avatar(id, ruta, function(err, avatar){
                if (!err) {
                    userServices.getEmail(avatar, (err2, user)=>{
                        if(!err2){
                            req.session.usuario=user
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
            if (req.session.usuario.acceso=='admin') {
                userServices.get((err, usuarios)=>{
                    if(!err){
                        res.json({status:'SUCCESS', usuarios})
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
    //////////////////      lista usuario por acceso
    ///////////////////////////////////////////////////////////////////////////
    app.get('/x/v1/users/acceso/:acceso', (req,res)=>{
        if(req.session.usuario){
            userServices.getByAcceso(req.params.acceso, (err, usuarios)=>{
                if(!err){
                    res.json({status:'SUCCESS', usuarios})
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
                console.log(usuarios)
                res.json({status:'SUCCESS', usuarios})
            }else{
                res.json({ status: 'FAIL', usuarios:[], err}) 
            }
        })
        
    })


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/x/v1/user/logout', function(req, res) {
        req.session.usuario = null
        res.json({ status:true, code:1 }); 
    });

    
         
}