import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoService, Todo } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TodoService]
})
export class AppComponent implements OnInit {
  tasks: Todo[] = [];
  newTaskTitle = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  editingId: number | null = null;
  editText = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTodos().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTodo: Omit<Todo, 'id'> = {
      title: this.newTaskTitle.trim(),
      completed: false
    };

    this.todoService.createTodo(newTodo as Todo).subscribe(task => {
      this.tasks.push(task);
      this.newTaskTitle = '';
    });
  }

  toggleTask(task: Todo) {
    this.todoService.updateTodo(task.id, {
      ...task,
      completed: !task.completed
    }).subscribe(updatedTask => {
      this.tasks = this.tasks.map(t => t.id === task.id ? updatedTask : t);
    });
  }

  deleteTask(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

  startEditing(task: Todo) {
    this.editingId = task.id;
    this.editText = task.title;
  }

  handleEdit(task: Todo) {
    if (!this.editText.trim()) return;

    this.todoService.updateTodo(task.id, {
      ...task,
      title: this.editText.trim()
    }).subscribe(updatedTask => {
      this.tasks = this.tasks.map(t => t.id === task.id ? updatedTask : t);
      this.editingId = null;
      this.editText = '';
    });
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter = filter;
  }

  get filteredTasks() {
    switch (this.filter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }
}
