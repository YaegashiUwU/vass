const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'u136683694_Estadias2109',
    password: 'Tyatry9g',
    database: 'u136683694_bolsa',

});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

module.exports = db;