//Importamos sequelize
const Sequelize = require('sequelize');

//Importamos la configuracion de la db
const db = require('../config/db');

const slug = require('slug');
const shortid = require('shortid');

//Definimos el modelo, de nombre tiene Proyectos(igual al archivo)
//El primer parametro es el nombre que tendra la tabla en la db
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // nombre: {
    //     type: Sequelize.STRING
    // }

    //Cuando solo tiene una sola propiedad se puede omitir codigo
    nombre : Sequelize.STRING,
    url : Sequelize.STRING
},{
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase();
            
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;
