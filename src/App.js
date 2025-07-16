// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Registration';
import TodoApp from './components/TodoApp';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <TodoApp />
          </ProtectedRoute>
        }
      />
          <Route
         path="/profile"
          element={
           <ProtectedRoute>
             <Profile />
             </ProtectedRoute>
  }
/>
      <Route path="*" element={<Login />} /> {/* Optional: fallback route */}
    </Routes>
  );
}

export default App;
