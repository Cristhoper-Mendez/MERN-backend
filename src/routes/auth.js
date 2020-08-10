const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

//  login
// api/auth
router.post('/',
    authController.autenticarUsuario
);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAuth
)

module.exports = router;