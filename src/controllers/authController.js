const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    
    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    //extraer email pass
    const { email, password } = req.body;

    try {
        // revisar si el usuario existe
        let usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({
                mensaje: 'El usuario no existe'
            })
        }

        //revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({
                mensaje: 'password incorrecto'
            })
        }

        //si todo es correcto
        //crear y firmar token
        const payload = {
            usuario: {
                _id: usuario._id
            }
        };

        //firmar token
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion 
            res.json({
                mensaje: 'Creado correctamente ',
                token
            })
        });

    } catch (error) {
        console.log(error);
    }
}

// obtiene que usuario esta autenticado
exports.usuarioAuth = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario._id).select('-password');
        res.json({
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error'
        });
    }
}