const express = require('express');
const app = express(); // Cambié 'App' a 'app' en minúscula, como es común en las convenciones de Express
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'empleados_crud'
});

// Middleware para poder leer JSON en las solicitudes
app.use(express.json());

// Ruta para crear un empleado
app.post('/create', (req, res) => {
  const { nombre, edad, pais, cargo, anios } = req.body;
  
  // Consulta para insertar un nuevo empleado
  db.query(
    'INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?, ?, ?, ?, ?)',
    [nombre, edad, pais, cargo, anios],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al registrar los valores');
      } else {
        res.send('Valores registrados con éxito');
      }
    }
  );
});



app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al obtener los empleados');
        } else {
            res.send(result);
        }
    })
})




// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});
