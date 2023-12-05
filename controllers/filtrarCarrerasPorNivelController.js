const db = require('../database/db');

module.exports = {
    filtrarEmpresasPorNivel: (req, res) => {
        const NivelAcademico = req.params.NivelAcademico;

        if (NivelAcademico === "TSU" || NivelAcademico == "ING-LIC") {
            db.query('SELECT * FROM empresas WHERE NivelAcademico = ?', NivelAcademico, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error de servidor' });
                }

                return res.json(results);
            });

        } else {
            db.query(`Select * FROM empresas WHERE NivelAcademico IN ('TSU'and'ING-LIC')`, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error de servidor' });
                }

                return res.json(results);
            })
        }

    },
    filtrarCarrerasPorNivel: (req, res) => {
        const nivel = req.params.nivel;


        if (nivel === "TSU" || nivel == "ING-LIC") {
            db.query('SELECT * FROM carreras WHERE nivel = ?', nivel, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error de servidor' });
                }

                return res.json(results);
            });

        } else {
            db.query(`Select * FROM carreras WHERE nivel IN ('TSU'and'ING-LIC')`, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error de servidor' });
                }

                return res.json(results);
            })
        }

    },

}