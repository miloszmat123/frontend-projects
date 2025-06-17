import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, FormCheck } from 'react-bootstrap';
import { todoService } from '../services/todoService';
import { Todo } from '../types/todo';

const TodoComponent: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await todoService.createTodo({ title: newTodo, completed: false });
      setTodos([...todos, todo]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const handleEdit = async (todo: Todo) => {
    if (!editText.trim()) return;

    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        ...todo,
        title: editText
      });
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <Container>
      <div className="header">
        <h1>Todo App</h1>
        <p>Manage your tasks efficiently</p>
      </div>

      <Form onSubmit={handleSubmit} className="task-form">
        <Form.Group className="d-flex gap-2">
          <Form.Control
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow-1"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </Form.Group>
      </Form>

      <div className="filter-buttons">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline-primary'}
          onClick={() => setFilter('all')}
          className="flex-grow-1"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'primary' : 'outline-primary'}
          onClick={() => setFilter('active')}
          className="flex-grow-1"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline-primary'}
          onClick={() => setFilter('completed')}
          className="flex-grow-1"
        >
          Completed
        </Button>
      </div>

      <ListGroup className="task-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-clipboard-check"></i>
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <ListGroup.Item key={todo.id} className="d-flex align-items-center gap-3">
              <FormCheck
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="flex-shrink-0"
              />
              {editingId === todo.id ? (
                <Form.Control
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleEdit(todo)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo)}
                  className="flex-grow-1"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-grow-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
                  onDoubleClick={() => startEditing(todo)}
                >
                  {todo.title}
                </span>
              )}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => startEditing(todo)}
                className="flex-shrink-0 me-2"
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
};

export default TodoComponent; 