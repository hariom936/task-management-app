import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import TaskItem from '../components/TaskItem';

function TaskList() {
  // Dummy task data for now
  const [tasks] = useState([
    { id: 1, title: 'Grocery Shopping', description: 'Buy milk, eggs, and bread', status: 'Pending', dueDate: '2025-04-22' },
    { id: 2, title: 'Book Appointment', description: 'Schedule a doctor\'s appointment', status: 'In Progress', dueDate: '2025-04-25' },
    { id: 3, title: 'Pay Bills', description: 'Electricity and internet bills', status: 'Completed', dueDate: '2025-04-20' },
  ]);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTasks = filterStatus === 'All' ? tasks : tasks.filter(task => task.status === filterStatus);

  return (
    <Container className="mt-4">
      <h2>Task List</h2>
      <div className="mb-3">
        <Button variant="primary">Add New Task</Button>
      </div>
      <Form.Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="mb-3"
      >
        <option value="All">All Tasks</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Form.Select>
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredTasks.map(task => (
          <Col key={task.id}>
            <TaskItem task={task} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TaskList;