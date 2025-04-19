import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskList from './pages/TaskList';
import TaskForm from './components/TaskForm'; // Import TaskForm for testing

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<div>Home Page Content</div>} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/add-task" element={<TaskForm />} /> {/* Temporary route for testing form */}
          <Route path="/edit-task/:id" element={<TaskForm />} /> {/* Temporary route for testing form */}
          <Route path="/logout" element={<div>Logout Page Content</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;