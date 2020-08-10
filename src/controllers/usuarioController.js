const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    //extraer datos
    const { email, password } = req.body
    let body = req.body; 
    
    try {
        //validar usuario unico
        let usuario = await Usuario.findOne({ email });
        if(usuario){
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        //encriptar password
        const salt = await bcryptjs.genSalt(10);
        body.password = await bcryptjs.hash(password, salt);

        // guardar usuario
        const usuarioDB = await Usuario.create(body);

        //crear y firmar token
        const payload = {
            usuario: {
                _id: usuarioDB._id
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

