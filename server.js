const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const loginRoutes = require('./routes/login');
const empresaRoutes = require('./routes/empresa');
const obtenerCarrerasRoutes = require('./routes/obtenerCarreras');
const filtrarCarrerasPorNivelRoutes = require('./routes/filtrarCarrerasPorNivel');
const alumnosRoutes = require('./routes/alumnos');


app.use('/api', loginRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/obtenerCarreras', obtenerCarrerasRoutes);
app.use('/api/filtrarCarrerasPorNivel', filtrarCarrerasPorNivelRoutes);
app.use('/api/alumnos', alumnosRoutes);

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});