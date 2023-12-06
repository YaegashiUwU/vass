const mysql = require('mysql');

var dbConfig = {
    host: 'srv1267.hstgr.io',
    user: 'u136683694_Estadias2109',
    password: 'Tyatry9g',
    database: 'u136683694_bolsa',
};

var db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig); // Crea una nueva conexión usando los parámetros de conexión

    db.connect(err => { // Intenta conectar a la base de datos
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Espera 2 segundos antes de intentar reconectar
        } else {
            console.log('Conexión a la base de datos establecida');
        }
    });

    db.on('error', err => { // Escucha errores en la conexión
        console.error('Error en la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Si se pierde la conexión, reconecta
            handleDisconnect();
        } else {
            throw err; // Si es otro tipo de error, lanza una excepción
        }
    });
}

handleDisconnect();

module.exports = db;