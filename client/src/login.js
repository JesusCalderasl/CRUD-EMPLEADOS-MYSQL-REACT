// login.js
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
      return;
    }
    axios.post('http://localhost:3001/login', { email, password })
      .then(response => {
        Swal.fire('Login exitoso', response.data.message, 'success');
        setIsAuthenticated(true);
        navigate('/empleados');
      })
      .catch(error => {
        Swal.fire('Error', error.response?.data?.message || 'Error al iniciar sesión', 'error');
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Inicio de Sesión</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-3"
        />
        
        <div className="position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
          />
          <i 
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute`} 
            onClick={toggleShowPassword}
            style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
          ></i>
        </div>

        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        
        <p className="text-center">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
