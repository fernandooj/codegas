
//let localStrategy = require('passport-local').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let User = require('../models/userModel.js');
let configAuth = require('./auth');


module.exports =  function(passport){
 // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


//////////////////////////////////////////////////////////////////////////////////////////
/**
    REGISTRO Y LOGIN CON GOOGLE
**/
//////////////////////////////////////////////////////////////////////////////////////////
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        console.log(profile)
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'googleId' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.puntaje      = 10;
                    newUser.email        = profile.emails[0].value;
                    newUser.tipo         = 'suscriptor';
                    newUser.activo       = true;
                    newUser.username     = profile.emails[0].value;
                    newUser.googleId     = profile.id;
                    newUser.token        = token;
                    newUser.sexo         = profile.gender;
                    newUser.nombre       = profile.displayName ?profile.displayName : profile.name.givenName +' ' +profile.name.familyName; 
                    newUser.avatar       = profile.photos[0].value;
                    

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



//////////////////////////////////////////////////////////////////////////////////////////
/**
    REGISTRO Y LOGIN CON FACEBOOK
**/
//////////////////////////////////////////////////////////////////////////////////////////

passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'email',  'gender', 'link', 'locale', 'name', 'photos', 'updated_time', 'verified'],
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // console.log(profile) 
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebookId' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebookId    = profile.id; // set the users facebook id                   
                    newUser.token = token; // we will save the token that facebook provides to the user                    
                    //newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    //newUser.facebook.email = profile.email; // look at the passport user profile to see how names are returned
                    newUser.nombre  = profile.displayName ?profile.displayName : profile.name.givenName +' ' +profile.name.familyName; // look at the passport user profile to see how names are returned
                    //newUser.facebook.email     = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.email        = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.tipo         = 'suscriptor';
                    newUser.activo       = true;
                    newUser.username     = profile.emails[0].value;
                    newUser.puntaje      = 10;
                    newUser.avatar       = profile.photos[0].value;
                    newUser.sexo         = profile.gender;
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

//////////////////////////////////////////////////////////////////////////////////////////
/**
    SIGN UP LOCAL Y DEVUELVO LA SESION DEL USUARIOS DESPUES QUE ACTIVO EL TOKEN
**/
//////////////////////////////////////////////////////////////////////////////////////////

    passport.use('local-signup', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            nameField : 'name',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        }, 
        function(req, email, password, done) {
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                let newUser = new User();
                User.findOne({ '_id' :  req.session.usuario.id }, function(error, user) {
                    if(error)
                        return done(null, error);  
                    if(!user){
                        return done(null, {status:'FAIL'});     
                    }else{
                        User.findByIdAndUpdate(user._id, {$set: {
                            'local.password':   newUser.generateHash(req.body.password),
                            'email'   : email,
                            'puntaje' : 10,
                            'tipo'    : 'suscriptor'
                        }}, function(err, userList) {
                            if (err)
                                throw err;
                            return done(null, userList);  
                        });
                    }
                })
            });
        }
    ));




//////////////////////////////////////////////////////////////////////////////////////////
/**
    GENERO EL LOGIN LOCAL Y DEVUELVO LA SESION DEL USUARIOS DESPUES QUE ACTIVO EL TOKEN
**/
//////////////////////////////////////////////////////////////////////////////////////////

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        console.log({email, password})
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

}