const {Router} = require('express');

const {login, loginCliente}  = require('../Controllers/authController')
const { validarCampos } = require('../Middlewares/validarCampos');
const { check } = require('express-validator');

const router = Router();
router.post('/', 
        check('username', 'Usuario obligatorio' ).not().isEmpty(),
        check('password', ' password obligatorio' ).not().isEmpty(),
        validarCampos,
        login
        )
router.post('/mov', 
        check('email', 'Email obligatorio' ).not().isEmpty(),
        check('password', ' password obligatorio' ).not().isEmpty(),
        validarCampos,
        loginCliente
        )


module.exports = router;