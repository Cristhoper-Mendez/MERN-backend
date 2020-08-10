const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');

//crear proyectos
// api/proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del poryecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.crearProyecto
);

//obtener todos los proyectos del usuario actual
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//actualizar proyecto
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del poryecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;
