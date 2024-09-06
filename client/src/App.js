import './App.css';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [anios, setAnios] = useState();

  const [empleadosList, setEmpleadosList] = useState([]);


  //para agregar empleados
  const add = () => {
    axios.post('http://localhost:3001/create', {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      console.log('Empleado agregado');
    }).catch((error) => {
      console.log('Error al agregar empleado:', error);
    });
  };

  //para obtener empleados
  const getEmpleados = () => {
    axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleadosList(response.data);
    });
  }




  return (
    <div class="container-fluid">
      <div className="App">


      </div>

      <div class="card text-center">
        <div class="card-header">
          GESTIÓN DE EMPLEADOS
        </div>
        <div Name="card-body">
       
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Nombre:</span>
            </div>
            <input type="text" onChange={(e) => setNombre(e.target.value)} 
            className="form-control" placeholder="Ingrese nombre" aria-label="Nombre" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon2">Edad:</span>
            </div>
            <input type="number" onChange={(e) => setEdad(e.target.value)} 
            className="form-control" placeholder="Ingrese edad" aria-label="Edad" aria-describedby="basic-addon2" />
          </div>

         
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon3">País:</span>
            </div>
            <input type="text" onChange={(e) => setPais(e.target.value)} 
            className="form-control" placeholder="Ingrese país" aria-label="País" aria-describedby="basic-addon3" />
          </div>

          
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon4">Cargo:</span>
            </div>
            <input type="text" onChange={(e) => setCargo(e.target.value)} 
            className="form-control" placeholder="Ingrese cargo" aria-label="Cargo" aria-describedby="basic-addon4" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon5">Años:</span>
            </div>
            <input type="number" onChange={(e) => setAnios(e.target.value)} 
            className="form-control" placeholder="Ingrese años" aria-label="Años" aria-describedby="basic-addon5" />
          </div>
        </div>

        <div class="card-footer text-muted">

          <button className='btn btn-success' onClick={add}>Registrar</button>


          <div className="lista">
            <button className='btn btn-dark' onClick={getEmpleados}>Mostrar empleados</button>
            {empleadosList.map((val, key) => {
              return (
                <div key={key} className="empleado">
                  <h3>Nombre: {val.nombre}</h3>
                  <h3>Edad: {val.edad}</h3>
                  <h3>País: {val.pais}</h3>
                  <h3>Cargo: {val.cargo}</h3>
                  <h3>Años: {val.anios}</h3>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );


}

export default App;
