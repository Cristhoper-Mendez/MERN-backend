const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')
exports.crearProyecto = async ( req, res ) => {
    
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    const body = req.body;
    
    try {
        //asignar creador
        body.creador = req.usuario._id;

        //crear proyecto
        const proyectoDB = await Proyecto.create(body);

        res.json({
            mensaje: 'Creado',
            proyectoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//obtener todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario._id }).sort({ fecha: -1 });

        res.json(proyectos)
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//actualiza un proyecto
exports.actualizarProyecto = async ( req, res ) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    //extraer info del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        
        //revisar id
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si existe proyecto
        if(!proyecto) {
            return res.status(404).json({
                mensaje: 'Proyecto no encontrado'
            })
        }

        //verificar el creador
        if(proyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            })
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoProyecto }, { new: true });

        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//elimina un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar id
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si existe proyecto
        if(!proyecto) {
            return res.status(404).json({
                mensaje: 'Proyecto no encontrado'
            })
        }

        //verificar el creador
        if(proyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            })
        }

        //eliminar el proyecto
        await Proyecto.findOneAndDelete({ _id : req.params.id });

        res.json({
            mensaje: 'El proyecto fue eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}