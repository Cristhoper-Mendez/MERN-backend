const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res) => {
    const body = req.body;

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    //extraer el proyecto
    const { proyecto } = req.body;

    try {
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({
                mensaje: 'Proyecto no encontrado'
            })
        }

        //validar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            })
        }

        // crear tarea
        const tareaDB = await Tarea.create(body);
        res.json({
            tareaDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//obtener tareas por proyectos
exports.obtenerTareas = async (req, res) => {
    try {
        let { proyecto } = req.query;

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({
                mensaje: 'Proyecto no encontrado'
            })
        }

        //validar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            })
        }

        //obtener tareas por proyectos
        const tareas = await Tarea.find({ proyecto });
        res.json({
            tareas
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        let { proyecto, nombre, estado, _id } = req.body;
        
        //revisar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({
                mensaje: 'La tarea no fue emcontrada'
            });
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        console.log(existeProyecto);
        console.log(proyecto);
        // console.log(req.usuario._id);

        // validar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            });
        }

        //crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id }, nuevaTarea, { new: true } );

        // console.log(nuevaTarea);
        res.json({
            tarea
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        let { proyecto } = req.query;
        
        //revisar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({
                mensaje: 'La tarea no fue emcontrada'
            });
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // validar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario._id){
            return res.status(401).json({
                mensaje: 'No estas autorizado para esta accion'
            });
        }
        
        //eliminar la tarea
        await Tarea.findOneAndDelete({ _id: req.params.id });

        res.json({
            mensaje: 'Tarea eliminada'
        });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}