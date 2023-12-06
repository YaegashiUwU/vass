const mysql = require('mysql');

var dbConfig = {
    host: '44.226.145.213',
    user: 'u136683694_Estadias2109',
    password: 'Tyatry9g',
    database: 'u136683694_bolsa',
};

var db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Conexión a la base de datos establecida');
        }
    });

    db.on('error', function(err) {
        console.error('Error en la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            // Intenta reconectar
            handleDisconnect();
        } else {
            console.error('Error de base de datos no manejado:', err);
            // Aquí podrías decidir no lanzar la excepción
            // y manejar el error de otra manera
        }
    });

}

handleDisconnect();

module.exports = db;