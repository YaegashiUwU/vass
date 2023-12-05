const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        // Genera un nombre de archivo único sin espacios ni caracteres especiales
        const originalname = file.originalname;
        const fileExtension = originalname.split('.').pop(); // Obtiene la extensión del archivo
        const cleanFilename = originalname.replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres especiales
        // Combina el nombre limpio y la extensión para crear el nombre final del archivo
        const uniqueFilename = `${cleanFilename}-${Date.now()}.${fileExtension}`;

        cb(null, uniqueFilename);
    },
});

const upload = multer({ storage: storage });

const empresaController = require('../controllers/empresaController');

router.get('/', empresaController.obtenerEmpresas);
router.post('/agregar', upload.single('flyer'), empresaController.agregarEmpresa);
router.put('/editar/:id', empresaController.editarEmpresa);
router.delete('/eliminar/:id', empresaController.eliminarEmpresa);
router.post('/subir-imagen', upload.single('imagen'), empresaController.subirImagen);
router.get('/flyers', empresaController.flyers);
router.get('/buscar-por-carrera/:carreraId', empresaController.buscarPorCarrera);
router.get('/empresaid/:id', empresaController.empresaid)
router.post('/csv-registrar', empresaController.registrarDesdeCSV);


module.exports = router;