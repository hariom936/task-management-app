import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsCheckCircleFill  } from 'react-icons/bs';

function TaskItem({ task }) {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        {task.description && <Card.Subtitle className="mb-2 text-muted">{task.description.substring(0, 50)}{task.description.length > 50 && '...'}</Card.Subtitle>}
        <Badge bg={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
        <div className="mt-2">
          <Button variant="outline-primary" size="sm" className="me-2">
            <BsPencilSquare /> Edit
          </Button>
          <Button variant="outline-danger" size="sm" className="me-2">
            <BsTrash /> Delete
          </Button>
          <Button variant="outline-success" size="sm">
            <BsCheckCircleFill  /> Complete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskItem;