import './App.css';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function App() {
  const [nombre, setNombre] = useState("");
  const [dpi, setDpi] = useState("");
  const [edad, setEdad] = useState("");
  const [direccion, setDireccion] = useState('');
  const [cargo, setCargo] = useState('');
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);
  const [mostrar, setMostrar] = useState(false); // Estado para alternar entre mostrar y ocultar

  const [empleadosList, setEmpleadosList] = useState([]);

  // Validar campos vacíos
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

  //para agregar empleados
  const add = () => {
    if (!validarCampos()) {
      return; // No procede si los campos están vacíos
    }
    axios.post('http://localhost:3001/create', {
      nombre: nombre,
      edad: edad,
      direccion: direccion,
      cargo: cargo,
      dpi: dpi
    }).then(() => {
      getEmpleados();
      limpiar();
      Swal.fire({
        title: "<strong>Registro exitoso</strong>",
        html: "<i>El empleado <strong>" + nombre + "</strong> fue registrado con éxito.</i>",
        icon: 'success',
        timer: 4000
      });
    });
  };

  //para actualizar empleados
  const update = () => {
    if (!validarCampos()) {
      return; // No procede si los campos están vacíos
    }
    axios.put('http://localhost:3001/update', {
      id: id,
      nombre: nombre,
      dpi: dpi,
      edad: edad,
      direccion: direccion,
      cargo: cargo
    }).then(() => {
      getEmpleados();
      limpiar();
      Swal.fire({
        title: "<strong>Actualización exitosa</strong>",
        html: "<i>El empleado <strong>" + nombre + "</strong> fue actualizado con éxito.</i>",
        icon: 'success',
        timer: 4000
      });
    }).catch((error) => {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intenta más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  //para editar empleados
  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setDireccion(val.direccion);
    setCargo(val.cargo);
    setDpi(val.dpi);
    setId(val.id);
  };

  //para eliminar empleados
  const eliminarEmpleado = (val) => {
    Swal.fire({
      title: "Confirmar eliminación",
      html: "<i>¿Desea eliminar a <strong>" + val.nombre + "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados();
            limpiar();
            Swal.fire({
              text: val.nombre + ' fue eliminado.',
              icon: "success",
              timer: 4000
            });
          }).catch((error) => {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "No se pudo eliminar el empleado",
              footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intenta más tarde" : JSON.parse(JSON.stringify(error)).message
            });
          });
      }
    });
  };

  //para obtener empleados
  const getEmpleados = () => {
    axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleadosList(response.data);
    });
  };

  //para limpiar los campos
  const limpiar = () => {
    setNombre('');
    setEdad('');
    setDireccion('');
    setCargo('');
    setDpi('');
    setEditar(false);
  };

  // Alternar entre mostrar y ocultar empleados
  const alternarMostrar = () => {
    if (mostrar) {
      setMostrar(false); // Ocultar empleados
    } else {
      getEmpleados();
      setMostrar(true); // Mostrar empleados
    }
  };

  return (
    <div className="container-fluid">
      <div className="App"></div>

      <div className="card text-center">
        <div className="card-header">
          GESTIÓN DE EMPLEADOS
        </div>
        <div className="card-body">
          {/* Campos de entrada */}
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Nombre:</span>
            </div>
            <input type="text" onChange={(e) => setNombre(e.target.value)}
              className="form-control" value={nombre} placeholder="Ingrese nombre" aria-label="Nombre" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon5">DPI:</span>
            </div>
            <input type="text" onChange={(e) => setDpi(e.target.value)}
              className="form-control" value={dpi} placeholder="Ingrese DPI" aria-label="dpi" aria-describedby="basic-addon5" maxLength="13" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon2">Edad:</span>
            </div>
            <input type="number" onChange={(e) => setEdad(e.target.value)}
              className="form-control" value={edad} placeholder="Ingrese edad" aria-label="Edad" aria-describedby="basic-addon2" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon3">Dirección:</span>
            </div>
            <input type="text" onChange={(e) => setDireccion(e.target.value)}
              className="form-control" value={direccion} placeholder="Ingrese su Dirección" aria-label="Dirección" aria-describedby="basic-addon3" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon4">Cargo:</span>
            </div>
            <input type="text" onChange={(e) => setCargo(e.target.value)}
              className="form-control" value={cargo} placeholder="Ingrese cargo" aria-label="Cargo" aria-describedby="basic-addon4" />
          </div>
        </div>

        <div className="card-footer text-muted">
          {
            editar === true ?
              <div>
                <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info m-2' onClick={limpiar}>Cancelar</button>
              </div>
              : (
                <>
                  <button className='btn btn-success m-2' onClick={add}>Registrar</button>
                  <button className='btn btn-primary m-2' onClick={alternarMostrar}>
                    {mostrar ? 'Ocultar' : 'Mostrar'} Empleados
                  </button>
                </>
              )
          }
        </div>
      </div>

      {mostrar && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">DPI</th>
              <th scope="col">Edad</th>
              <th scope="col">Dirección</th>
              <th scope="col">Cargo</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              empleadosList.map((val, key) => {
                return (
                  <tr key={val.id}>
                    <th>{val.id}</th>
                    <td>{val.nombre}</td>
                    <td>{val.dpi}</td>
                    <td>{val.edad}</td>
                    <td>{val.direccion}</td>
                    <td>{val.cargo}</td>

                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" onClick={() => editarEmpleado(val)} className="btn btn-info">Editar</button>
                      <button type="button" onClick={() => eliminarEmpleado(val)} className="btn btn-danger">Eliminar</button>
                    </div>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
