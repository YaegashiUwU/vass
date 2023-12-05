const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Controlador de login

router.post('/login', loginController.iniciarSesion);

module.exports = router;