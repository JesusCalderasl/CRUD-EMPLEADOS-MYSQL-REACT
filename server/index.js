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
  const { nombre, dpi, edad, direccion, cargo,  } = req.body;
  
  // Consulta para insertar un nuevo empleado
  db.query(
    'INSERT INTO empleados (nombre, dpi, edad, direccion, cargo) VALUES (?, ?, ?, ?, ?)',
    [nombre, dpi, edad, direccion, cargo],
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


//mostrar empleados
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

//actualizar empleados
app.put('/update', (req, res) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const dpi = req.body.dpi;
  const edad = req.body.edad;
  const direccion = req.body.direccion;
  const cargo = req.body.cargo;


  db.query(
    'UPDATE empleados SET nombre = ?, dpi = ?, edad = ?, direccion = ?, cargo = ? WHERE id = ?',
    [nombre, dpi, edad, direccion, cargo, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al actualizar el empleado');
      } else {
        res.send('Empleado actualizado con éxito');
      }
    }
  );
});

//eliminar empleados
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM empleados WHERE id = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al eliminar el empleado');
    } else {
      res.send('Empleado eliminado con éxito');
    }
  });
});




// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});
