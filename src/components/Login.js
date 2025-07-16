import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure firebase.js is properly configured

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("You have successfully login");
      navigate('/todo');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="bg-light border p-4 rounded shadow" 
      style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div
            className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: 60, height: 60, margin: '0 auto' }}
          >
            <i className="bi bi-check2-square text-white fs-3"></i>
          </div>
          <h4 className="mt-3">Welcome Back</h4>
          <p className="text-muted mb-0">Sign in to your To-Do account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none">
              Go to Register
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
