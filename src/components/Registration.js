import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this path matches your setup

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/todo');
      alert("User register successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="bg-white p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div
            className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: 60, height: 60, margin: '0 auto' }}
          >
            <i className="bi bi-person-plus-fill text-white fs-3"></i>
          </div>
          <h4 className="mt-3">Create Account</h4>
          <p className="text-muted mb-0">Sign up for a new To-Do account</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="mb-3">
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

          <div className="mb-4">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none">
              Go to Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
