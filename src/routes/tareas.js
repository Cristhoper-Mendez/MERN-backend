const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tareaController = require('../controllers/tareaController');
const auth = require('../middlewares/auth');

//crear tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//obtener todas las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//eliminar una tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;

