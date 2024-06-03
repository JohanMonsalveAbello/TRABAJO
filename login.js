const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ghanjadrops',
    user: 'root',
    password: ''
});

app.listen(9300, () => {
    console.log('Servidor corriendo en el puerto 9300');
});

conexion.connect(error => {
    if (error) throw error;
    console.log('Conexión exitosa a la base de datos');
});

app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    // Consulta para obtener la información del usuario por correo
    const query = 'SELECT * FROM ingreso WHERE correo = ?';
    conexion.query(query, [correo], async (error, results) => {
        if (error) {
            console.error('Error en la consulta SQL:', error.message);
            return res.status(500).json({ resultado: 'Error', mensaje: 'Error en la consulta SQL' });
        }

        if (results.length === 0) {
            return res.status(401).json({ resultado: 'Error', mensaje: 'Correo o contraseña incorrectos' });
        }

        const usuario = results[0];

        // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
        const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!esContrasenaValida) {
            return res.status(401).json({ resultado: 'Error', mensaje: 'Correo o contraseña incorrectos' });
        }

        // Genera un token JWT
        const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, 'secreto', { expiresIn: '1h' });

        res.json({ resultado: 'OK', mensaje: 'Inicio de sesión exitoso', token });
    });
});
