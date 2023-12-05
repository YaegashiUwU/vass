const express = require('express');
const router = express.Router();
const obtenerCarrerasController = require('../controllers/obtenerCarrerasController');

router.get('/', obtenerCarrerasController.obtenerCarreras);

module.exports = router;