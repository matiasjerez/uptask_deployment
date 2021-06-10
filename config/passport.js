const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo a autenticar

const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propias(username-password)
passport.use(
    new LocalStrategy(
        //Por defaul passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //El usuario existe pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    });
                }
                //El email existe y el password correcto
                return done(null, usuario);
            } catch{
                //El usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                });
            }
        }   
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

module.exports = passport;
