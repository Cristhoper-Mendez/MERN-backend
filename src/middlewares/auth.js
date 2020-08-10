const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //leer el token del header
    const token = req.header('x-auth-token');

    //revisar si hay token
    if(!token ){
        return res.status(401).json({
            mensaje: 'No hay token, permiso denegado'
        })
    }

    //validar token

    try {
        const cifrado = jwt.verify(token, process.env.SECRET);

        req.usuario = cifrado.usuario;

        next();
    } catch (error) {
        res.status(401).json({
            mensaje: 'Token no valido'
        });
    }
}