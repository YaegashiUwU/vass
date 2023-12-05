const db = require('../database/db');

module.exports = {
    obtenerCarreras: (req, res) => {
        // Lógica para obtener todas las carreras
        db.query('SELECT * FROM carreras', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error de servidor' });
            }
            res.json(results);
        });
    }
};