const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el módulo CORS

const app = express();

app.use(cors({
    origin: '',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization',
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const PUERTO = 9300;

const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ghanjadrops',
    user: 'root',
    password: ''
});

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});

conexion.connect(error => {
    if (error) throw error;
    console.log('Conexión exitosa a la base de datos');
});

app.get('/artistas', (req, res) => {
    const query = `SELECT * FROM artista;`;
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);

        if (resultado.length > 0) {
            console.log('Datos recuperados:', resultado);
            res.json(resultado);
        } else {
            res.json(`No hay registros`);
        }
    });
});

app.get('/artistas/:CODIGO', (req, res) => {
    const { CODIGO } = req.params;

    const query = `SELECT * FROM artista WHERE CODIGO=${CODIGO};`;
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.json(`No hay registros`);
        }
    });
});

app.post('/artistas/nuevo', (req, res) => {
    const {
        TALENTO,
        GENERO,
        CODIGO,
        CODIGO_TP,
        CODIGO_ROL,
        COD_ES,
        CODIGO_TC,
        N_DOC,
        ESTADO,
        CORREO,
        TELEFONO,
        P_NOMBRE,
        S_NOMBRE,
        P_APELLIDO,
        S_APELLIDO
    } = req.body;

    const query = 'INSERT INTO artista SET ?';

    conexion.query(query, {
        TALENTO,
        GENERO,
        CODIGO,
        CODIGO_TP,
        CODIGO_ROL,
        COD_ES,
        CODIGO_TC,
        N_DOC,
        ESTADO,
        CORREO,
        TELEFONO,
        P_NOMBRE,
        S_NOMBRE,
        P_APELLIDO,
        S_APELLIDO
    }, (error) => {
        if (error) return console.error(error.message);

        res.json({ resultado: 'OK', mensaje: 'Se insertó correctamente el artista' });
    });
});

app.put('/artistas/actualizar/:CODIGO', (req, res) => {
    const { CODIGO } = req.params;
    const {
        TALENTO,
        GENERO,
        CODIGO_TP,
        CODIGO_ROL,
        COD_ES,
        CODIGO_TC,
        N_DOC,
        ESTADO,
        CORREO,
        TELEFONO,
        P_NOMBRE,
        S_NOMBRE,
        P_APELLIDO,
        S_APELLIDO
    } = req.body;

    const query = `UPDATE artista SET TALENTO='${TALENTO}', GENERO='${GENERO}', CODIGO='${CODIGO}', CODIGO_TP='${CODIGO_TP}', CODIGO_ROL='${CODIGO_ROL}', COD_ES='${COD_ES}', CODIGO_TC='${CODIGO_TC}', N_DOC='${N_DOC}', ESTADO='${ESTADO}', CORREO='${CORREO}', TELEFONO='${TELEFONO}', P_NOMBRE='${P_NOMBRE}', S_NOMBRE='${S_NOMBRE}', P_APELLIDO='${P_APELLIDO}', S_APELLIDO='${S_APELLIDO}' WHERE CODIGO='${CODIGO}';`;

    conexion.query(query, (error) => {
        if (error) return console.error(error.message);

        res.json({ resultado: 'OK', mensaje: 'Se actualizó' });
    });
});


app.delete('/artistas/borrar/:CODIGO', (req, res) => {
    const { CODIGO } = req.params;

    const query = `DELETE FROM artista WHERE CODIGO=${CODIGO};`;
    conexion.query(query, (error) => {
        if (error) console.error(error.message);

        res.json({ resultado: 'OK', mensaje: 'Se elimino' });
    });
});
