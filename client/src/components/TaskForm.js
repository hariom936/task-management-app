import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log({ title, description, status, dueDate });
    // Reset form after submission (for now)
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setDueDate('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDueDate">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicStatus">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Save
      </Button>
      <Button variant="secondary" onClick={() => console.log('Cancel')}>
        Cancel
      </Button>
    </Form>
  );
}

export default TaskForm;