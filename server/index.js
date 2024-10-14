const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/empleados_crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Definir esquemas y modelos de Mongoose
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres.'] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^([\w.%+-]+)@gmail\.com$/i.test(v); // Solo acepta correos que terminen en @gmail.com
      },
      message: props => `${props.value} no es un correo de Gmail válido.`
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres.'] // Mínimo de 8 caracteres
  }
});


const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dpi: { type: String, required: true, unique: true },
  edad: { type: Number, required: true },
  direccion: { type: String, required: true },
  cargo: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
const Empleado = mongoose.model('Empleado', EmpleadoSchema);

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).send({ message: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  try {
    const newUser = new User({ username, email, password });  // Guarda el nombre de usuario, email y contraseña
    await newUser.save();
    res.send({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).send({ message: 'El email o el nombre de usuario ya están en uso.' });
    } else {
      res.status(500).send({ message: 'Error al registrar el usuario' });
    }
  }
});

// Ruta para iniciar sesión (solo con email y password)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.send({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).send({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para crear un empleado
app.post('/create', async (req, res) => {
  const { nombre, dpi, edad, direccion, cargo } = req.body;
  try {
    const newEmpleado = new Empleado({ nombre, dpi, edad, direccion, cargo });
    await newEmpleado.save();
    res.send('Empleado registrado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el empleado');
  }
});

// Ruta para obtener empleados
app.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.send(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los empleados');
  }
});

// Ruta para actualizar un empleado
app.put('/update', async (req, res) => {
  const { id, nombre, dpi, edad, direccion, cargo } = req.body;
  try {
    await Empleado.findByIdAndUpdate(id, { nombre, dpi, edad, direccion, cargo });
    res.send('Empleado actualizado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el empleado');
  }
});

// Ruta para eliminar un empleado
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Empleado.findByIdAndDelete(id);
    res.send('Empleado eliminado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el empleado');
  }
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});
