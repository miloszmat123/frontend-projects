import axios from 'axios';
import { Todo } from '../types/todo';

const API_URL = 'http://localhost:8000/api/todos/';

export const todoService = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createTodo: async (todo: { title: string; completed: boolean }): Promise<Todo> => {
    const response = await axios.post(API_URL, todo);
    return response.data;
  },

  updateTodo: async (id: number, todo: Todo): Promise<Todo> => {
    const response = await axios.put(`${API_URL}${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  }
}; 