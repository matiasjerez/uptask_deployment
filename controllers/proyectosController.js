const { vardump } = require('../helpers');
const { findAll } = require('../models/Proyectos');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('nuevoProyecto', {
        nombrePagina:'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    //Enviar a la consola lo que se escriba
    //console.log(req.body);

    //Validar que tenemmos algo en el input
    const {nombre} = req.body;
    
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    }

    // si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //No hay errores
        //const url = slug(nombre).toLowerCase();

        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }

}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas de proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }//,
        // include: [
        //     {model : Proyectos}
        // ]
    });


    if(!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req, res, next) => {
//En este caso el primer await bloquea la ejecucion hasta que termina la consulta
    // const proyectos = await Proyectos.findAll();
    // const proyecto = await Proyectos.findOne({
    //     where: {
    //         id: req.params.id
    //     }
    // });

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    }) 
}


exports.actualizarProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    //Enviar a la consola lo que se escriba
    //console.log(req.body);

    //Validar que tenemmos algo en el input
    const {nombre} = req.body;
    
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    }

    // si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //No hay errores
        //const url = slug(nombre).toLowerCase();


        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id }}
        );
        res.redirect('/');
    }

}

exports.eliminarProyecto = async (req, res, next) => {
    //req, query o params para obtener url
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto Eliminado!!!');

}