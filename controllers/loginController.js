const db = require('../database/db');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'Yaegashi'; // Cambia esto por una clave secreta real

module.exports = {

    iniciarSesion: async(req, res) => {
        const { matricula, contrasena } = req.body;

        db.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (results.length > 0) {
                const usuario = results[0];

                // Verifica la contraseña (esto debería ser una comparación de hash)
                if (usuario.contrasena === contrasena) {

                    const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1h' });
                    res.json({ token, tipo: usuario.tipo });
                } else {
                    res.status(401).json({ error: 'Credenciales incorrectas' });
                }
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        });
    }
}