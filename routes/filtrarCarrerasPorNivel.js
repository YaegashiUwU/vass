const express = require('express');
const router = express.Router();
const filtrarCarrerasPorNivelController = require('../controllers/filtrarCarrerasPorNivelController');

router.get('/empresa/:NivelAcademico', filtrarCarrerasPorNivelController.filtrarEmpresasPorNivel);
router.get('/carrera/:nivel', filtrarCarrerasPorNivelController.filtrarCarrerasPorNivel);

module.exports = router;