const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Funcion para verificar si el usuario esta logeado
exports.usuarioAutenticado = (req, res, next) => {

    //Si el usuario esta autenticado
    if(req.isAuthenticated()) {
        return next();
    }
    //Si no esta autenticado
    return res.redirect('/iniciar-sesion');
};

//Cerrar sesion
exports.cerrarSesion = (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
};

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) =>{
    //Verificar q el usuario existe
    const usuario = await Usuarios.findOne({where: {email: req.body.email}})

    //Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer');
    }

    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //Guardar en la base 
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req, res) =>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //sino encuentra el usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //Formuario para resetear el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) =>{


    //Verifica token y expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //Verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //hashear el password
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) ); 

    //Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Password modificado correctamente');
    res.redirect('/iniciar-sesion');
}