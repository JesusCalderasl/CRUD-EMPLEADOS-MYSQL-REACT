import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState("");
  const [dpi, setDpi] = useState("");
  const [edad, setEdad] = useState("");
  const [direccion, setDireccion] = useState('');
  const [cargo, setCargo] = useState('');
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);
  const [mostrar, setMostrar] = useState(true); // Estado para mostrar/ocultar la lista de empleados
  const [empleadosList, setEmpleadosList] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      getEmpleados();
    }
  }, [isAuthenticated]);

  const validarCampos = () => {
    if (!nombre || !dpi || !edad || !direccion || !cargo) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "warning",
        timer: 4000
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validarCampos()) return;
    axios.post('http://localhost:3001/create', { nombre, edad, direccion, cargo, dpi })
      .then(() => {
        getEmpleados();
        limpiar();
        Swal.fire('Registro exitoso', `El empleado ${nombre} fue registrado con éxito.`, 'success');
      });
  };

  const update = () => {
    if (!validarCampos()) return;
    axios.put('http://localhost:3001/update', { id, nombre, dpi, edad, direccion, cargo })
      .then(() => {
        getEmpleados();
        limpiar();
        Swal.fire('Actualización exitosa', `El empleado ${nombre} fue actualizado con éxito.`, 'success');
      }).catch((error) => {
        Swal.fire("Error", error.message || 'No se pudo actualizar el empleado', 'error');
      });
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setDireccion(val.direccion);
    setCargo(val.cargo);
    setDpi(val.dpi);
    setId(val._id);
  };

  const eliminarEmpleado = (val) => {
    Swal.fire({
      title: "Confirmar eliminación",
      html: `<i>¿Desea eliminar a <strong>${val.nombre}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/delete/${val._id}`).then(() => {
          getEmpleados();
          limpiar();
          Swal.fire(`${val.nombre} fue eliminado.`, '', 'success');
        }).catch((error) => {
          Swal.fire("Error", "No se pudo eliminar el empleado", 'error');
        });
      }
    });
  };

  const getEmpleados = () => {
    axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleadosList(response.data);
    });
  };

  const limpiar = () => {
    setNombre('');
    setEdad('');
    setDireccion('');
    setCargo('');
    setDpi('');
    setEditar(false);
  };

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    Swal.fire('Sesión cerrada', 'Has salido de la sesión exitosamente', 'info');
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/empleados" 
            element={isAuthenticated ? 
              <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="text-center">Gestión de Empleados</h1>
                  <button onClick={handleLogout} className="btn btn-danger btn-sm">
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
                
                {/* Formulario de empleado */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5 className="mb-3">{editar ? "Editar Empleado" : "Agregar Nuevo Empleado"}</h5>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <input 
                        type="text" 
                        placeholder="Nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} 
                        className="form-control form-control-sm" 
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input 
                        type="text" 
                        placeholder="DPI" 
                        value={dpi} 
                        onChange={(e) => setDpi(e.target.value.replace(/\D/g, '').slice(0, 13))} 
                        className="form-control form-control-sm" 
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <input 
                        type="number" 
                        placeholder="Edad" 
                        value={edad} 
                        onChange={(e) => setEdad(e.target.value.replace(/\D/g, '').slice(0, 2))} 
                        className="form-control form-control-sm" 
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="form-control form-control-sm" />
                    </div>
                    <div className="col-md-4 mb-2">
                      <input type="text" placeholder="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} className="form-control form-control-sm" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button onClick={editar ? update : add} className={`btn btn-sm ${editar ? 'btn-warning' : 'btn-success'} me-2`}>
                      <i className={`fas ${editar ? 'fa-edit' : 'fa-plus'}`}></i> {editar ? 'Actualizar' : 'Agregar'}
                    </button>
                    <button onClick={limpiar} className="btn btn-sm btn-secondary">
                      <i className="fas fa-eraser"></i> Limpiar
                    </button>
                  </div>
                </div>

                {/* Botón para mostrar/ocultar empleados */}
                <button onClick={toggleMostrar} className="btn btn-info btn-sm mb-3">
                  <i className={`fas ${mostrar ? 'fa-eye-slash' : 'fa-eye'}`}></i> {mostrar ? "Ocultar Lista de Empleados" : "Mostrar Lista de Empleados"}
                </button>

                {/* Tabla de empleados */}
                {mostrar && (
                  <table className="table table-striped table-bordered shadow-sm">
                    <thead className="table-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>DPI</th>
                        <th>Edad</th>
                        <th>Dirección</th>
                        <th>Cargo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosList.map((empleado) => (
                        <tr key={empleado._id}>
                          <td>{empleado.nombre}</td>
                          <td>{empleado.dpi}</td>
                          <td>{empleado.edad}</td>
                          <td>{empleado.direccion}</td>
                          <td>{empleado.cargo}</td>
                          <td>
                            <button className="btn btn-outline-warning btn-sm me-2" onClick={() => editarEmpleado(empleado)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarEmpleado(empleado)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div> 
              : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
