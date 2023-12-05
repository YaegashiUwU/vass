const db = require('../database/db');
const fs = require('fs');
const moment = require('moment');

// Función para insertar la empresa en la base de datos
const insertarEmpresa = async(empresaData) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO empresas SET ?', empresaData, (err, resultado) => {
            if (err) {
                reject(err);
            } else {
                resolve(resultado);
            }
        });
    });
};

const buscarCarreraIdPorNombre = async(nombreCarrera) => {

    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM carreras WHERE nombre = ?', [nombreCarrera], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length > 0) {
                return resolve(results[0].id);
            } else {
                return reject(new Error('Carrera no encontrada'));
            }
        });
    });
};

const insertarRelacionesEmpresaCarrera = async(empresa_id, carrerasIds) => {
    return new Promise((resolve, reject) => {

        // Asegurar que carrerasIds sea un array y que sus elementos sean números
        if (typeof carrerasIds === 'string') {
            // Convertir la cadena en un array
            carrerasIds = JSON.parse(carrerasIds);
        }

        if (!Array.isArray(carrerasIds)) {
            carrerasIds = [carrerasIds];
        }

        // Convertir todos los elementos a números
        carrerasIds = carrerasIds.map(id => Number(id));

        // Mapear las carrerasIds a un formato adecuado para la inserción masiva
        const relaciones = carrerasIds.map(id => [empresa_id, id]);

        // Insertar todas las relaciones en la base de datos
        db.query('INSERT INTO empresas_carreras (empresa_id, carrera_id) VALUES ?', [relaciones], (err) => {
            if (err) {
                console.log('Error al insertar relaciones:', err);
                reject(err);
            } else {
                console.log('Relaciones insertadas correctamente.');
                resolve();
            }
        });
    });
};




module.exports = {

    obtenerEmpresas: (req, res) => {
        db.query('SELECT * FROM empresas ORDER BY id DESC', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error de servidor' });
            }
            res.json(results);
        });
    },



    // Función para agregar la empresa y sus relaciones
    agregarEmpresa: async(req, res) => {
        const empresaData = req.body;

        // Separar las carreras del objeto principal
        const carrerasIds = empresaData.carreras;
        delete empresaData.carreras;

        // Añadir ruta de imagen al objeto principal
        empresaData.flyer = `uploads/${req.file.filename}`;

        // Añadir fecha actual al objeto principal
        empresaData.fecha = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            // Insertar empresa y obtener su ID
            const resultEmpresa = await insertarEmpresa(empresaData);

            // Insertar relaciones de la empresa con las carreras
            await insertarRelacionesEmpresaCarrera(resultEmpresa.insertId, carrerasIds);

            res.json({ mensaje: 'Empresa agregada exitosamente', id: resultEmpresa.insertId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error de servidor' });
        }
    },

    // Función para obtener las carreras relacionadas con una empresa
    obtenerCarrerasPorEmpresa: (empresaId) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT carrera_id FROM empresas_carreras WHERE empresa_id = ?', [empresaId], (err, resultados) => {
                if (err) {
                    reject(err);
                } else {
                    const carrerasIds = resultados.map((resultado) => resultado.carrera_id);
                    resolve(carrerasIds);
                }
            });
        });
    },

    editarEmpresa: (req, res) => {
        const idEmpresa = req.params.id;
        const nuevosDatos = req.body;
        db.query('UPDATE empresas SET ? WHERE id = ?', [nuevosDatos, idEmpresa], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error de servidor' });
            }
            res.json({ mensaje: 'Empresa editada exitosamente' });
        });
    },

    eliminarEmpresa: (req, res) => {
        const idEmpresa = req.params.id;
        console.log(idEmpresa)
        db.query('DELETE FROM empresas_carreras WHERE empresa_id = ?', idEmpresa, (err, resultados) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al eliminar relaciones de empresa con carreras' });
            }

            db.query('DELETE FROM empresas WHERE id = ?', idEmpresa, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al eliminar la empresa' });
                }
                res.json({ mensaje: 'Empresa y relaciones eliminadas exitosamente' });
            });
        });
    },

    subirImagen: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }
        res.json({ mensaje: 'Imagen subida exitosamente', imagen: req.file.filename });
    },

    empresaid: (req, res) => {
        const { id } = req.params;

        const query = "SELECT * FROM empresas WHERE id = ?";

        db.query(query, [id], (error, results, fields) => {
            if (error) {
                console.error("Error al obtener la empresa: ", error);
                res.status(500).json({ error: "Error al obtener la empresa" });
            } else {
                if (results.length > 0) {
                    res.json(results[0]); // Devuelve el primer resultado ya que se espera un único registro
                } else {
                    res.status(404).json({ message: "Empresa no encontrada" });
                }
            }
        })
    },
    // Controlador para buscar empresas por carrera
    buscarPorCarrera: (req, res) => {
        const carreraId = req.params.carreraId;

        db.query('SELECT empresa_id FROM empresas_carreras WHERE carrera_id = ?', carreraId, (err, resultados) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error de servidor' });
            }

            // Si no se encuentran empresas asociadas a la carrera, envía una respuesta acorde
            if (resultados.length === 0) {
                return res.status(200).json({ message: 'No se encontraron empresas para esta carrera' });
            }

            const empresaIds = resultados.map((resultado) => resultado.empresa_id);
            db.query('SELECT * FROM empresas WHERE id IN (?)', [empresaIds], (err, empresas) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error de servidor' });
                }
                // Si no hay empresas, envía una lista vacía o un mensaje
                if (empresas.length === 0) {
                    return res.status(200).json({ message: 'No se encontraron empresas para esta carrera' });
                }
                // Envía las empresas encontradas
                res.json(empresas);
            });
        });
    },


    flyers: (req, res) => {
        db.query('SELECT flyer FROM empresas', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error de servidor' });
            }
            res.json(results);
        })
    },

    registrarDesdeCSV: async(req, res) => {
        const empresas = req.body; // Asumiendo que esto es un array de objetos empresa
        let errores = [];

        for (let empresa of empresas) {
            try {
                // Insertar la empresa en la base de datos y obtener su ID
                const empresaData = await insertarEmpresa({
                    nombre: empresa.nombre,
                    paginaWeb: empresa.paginaWeb,
                    giro: empresa.giro,
                    NivelAcademico: empresa.NivelAcademico,
                    localidad: empresa.localidad,
                    contacto: empresa.contacto,
                    puesto: empresa.puesto,
                    telefonoExt: empresa.telefonoExt,
                    Ext: empresa.Ext,
                    telefono: empresa.telefono,
                    correo: empresa.correo,
                    vacante: empresa.vacante,
                    flyer: empresa.flyer,
                    vertientes: empresa.vertientes,
                });
                const empresaId = empresaData.insertId;
                console.log(empresaId)

                const carreras = [];
                if (empresa.CarrerasING) {
                    carreras.push(...empresa.CarrerasING.split(';'));
                }
                if (empresa.CarrerasTSU) {
                    carreras.push(...empresa.CarrerasTSU.split(';'));
                }


                console.log('Array de carreras:', carreras); // Deberías ver el arreglo de carreras

                for (const nombreCarrera of carreras) {
                    console.log('Procesando carrera:', nombreCarrera); // Esto debería imprimir cada carrera

                    if (typeof buscarCarreraIdPorNombre !== 'function') {
                        console.error('buscarCarreraIdPorNombre no está definido o no es una función');
                        continue; // Salta a la siguiente iteración
                    }

                    try {
                        const carreraId = await buscarCarreraIdPorNombre(nombreCarrera.trim());
                        console.log('ID de carrera encontrada:', carreraId); // Deberías ver el ID de la carrera

                        await insertarRelacionesEmpresaCarrera(empresaId, carreraId);
                    } catch (error) {
                        console.error('Error al buscar ID de carrera o al insertar relación:', error);
                        errores.push({ empresa: empresa.nombre, carrera: nombreCarrera, mensaje: error.message });
                    }
                }

            } catch (error) {
                errores.push({ empresa: empresa.nombre, mensaje: error.message });
            }
        }

        if (errores.length > 0) {
            res.status(400).send({ message: 'Ocurrieron errores durante el registro', errores });
        } else {
            res.send({ message: 'Empresas registradas correctamente' });
        }
    },





}