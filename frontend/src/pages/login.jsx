import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';

axios.defaults.baseURL = 'http://localhost:3001/auth'; // Default base URL for axios

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData);
      Swal.fire({
        title: 'Success!',
        text: 'Login successful.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-button'
        }
      }).then(() => {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/dashboard');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Login failed.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-button'
        }
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
            />
            <div className="forgot-password">
              <Link to="/forgetPassword" className="forgot-password-link">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link-text">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
