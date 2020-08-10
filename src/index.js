const express = require('express');
const conectarDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors')

//INICIALIZAR EXPRESS
const app = express();

//CONFIGS
require('dotenv').config();
app.use(morgan('dev'));
app.use(cors()); 

//PUERTO DEL APP
const PORT = process.env.PORT || 4000;

//conectar a la db
conectarDB();

//habilita express.json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//INICIAR EL SERVER
app.listen(PORT, () => console.log(`Server on port ${PORT}`));