const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnosController');

// Ruta para los alumno
router.post('/agregar', alumnosController.agregarAlumno);
router.get('/', alumnosController.verAlumnos);
router.post('/csv-registrar', alumnosController.registrarDesdeCSV);



module.exports = router;