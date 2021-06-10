const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');
const { sequelize } = require('../models/Proyectos');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
        notEmpty: {
            msg: 'El correo no puede estar vacio'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede estar vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE

}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) ); 
        }
    }
});

//Metodos personalisados
Usuarios.prototype.verificarPassword = function(password){
    return  bcrypt.compareSync(password, this.password);     
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;