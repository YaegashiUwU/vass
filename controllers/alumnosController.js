const db = require('../database/db');
const admin = "admin";
const alu = "alumno";
// Controlador para agregar un alumno

const agregarAlumno = (req, res) => {
    const { matricula } = req.body; // envía la matrícula en el cuerpo de la solicitud POST

    if (!matricula) {
        return res.status(400).json({ error: 'La matrícula es requerida.' });
    }

    // Inserta la matrícula y la contraseña (igual a la matrícula) en la base de datos
    const contrasena = matricula; // Asignamos la matrícula como contraseña
    const sql = `INSERT INTO usuarios(matricula, contrasena, tipo) VALUES (?, ?,'${alu}')`;
    db.query(sql, [matricula, contrasena], (err, result) => {
        if (err) {
            console.error('Error al agregar el alumno:', err);
            return res.status(500).json({ error: 'Error al agregar el alumno.' });
        }
        console.log('Alumno agregado con éxito:', result);
        res.status(201).json({ message: 'Alumno agregado con éxito.' });
    });
};

const verAlumnos = (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error de servidor' });
        }
        res.json(results);
    });
};
const registrarDesdeCSV = (req, res) => {
    const alumnos = req.body;

    if (!alumnos || alumnos.length === 0) {
        return res.status(400).json({ error: 'Datos de alumnos no proporcionados.' });
    }

    // Crear múltiples filas para la inserción
    const values = alumnos.map(alumno => [alumno.matricula, alumno.contrasena, alumno.nombre, alumno.email, alumno.tipo]);

    const sql = 'INSERT INTO usuarios (matricula, contrasena, nombre, email, tipo) VALUES ?';

    db.query(sql, [values], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar los alumnos.' });
        }
        res.status(201).json({ message: `${results.affectedRows} alumnos agregados con éxito.` });
    });
};

module.exports = {
    agregarAlumno,
    verAlumnos,
    registrarDesdeCSV

};