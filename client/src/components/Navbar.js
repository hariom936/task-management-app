// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Cookies from 'js-cookie'; // Import js-cookie

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logoutUser();
    authService.setAuthHeader(null);
    Cookies.remove('your_session_cookie_name'); // Replace 'your_session_cookie_name'
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary"> {/* Using bg-primary for a darker background */}
      <div className="container">
        <Link className="navbar-brand" to="/">Task Manager App</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {authService.getToken() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">Tasks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-task">Add Task</Link>
                </li>
              </>
            )}
            {authService.getToken() ? (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link text-decoration-none">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;