<script lang="ts">
  import { onMount } from 'svelte';
  import type { Todo } from '../types/todo';
  import { todoService } from '../services/todoService';

  let todos: Todo[] = [];
  let newTodo = '';
  let filter: 'all' | 'active' | 'completed' = 'all';
  let editingId: number | null = null;
  let editText = '';

  onMount(() => {
    loadTodos();
  });

  async function loadTodos() {
    try {
      todos = await todoService.getAllTodos();
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await todoService.createTodo({ title: newTodo, completed: false });
      todos = [...todos, todo];
      newTodo = '';
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  async function toggleTodo(todo: Todo) {
    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      todos = todos.map(t => t.id === todo.id ? updatedTodo : t);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      await todoService.deleteTodo(id);
      todos = todos.filter(todo => todo.id !== id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  function startEditing(todo: Todo) {
    editingId = todo.id;
    editText = todo.title;
  }

  async function handleEdit(todo: Todo) {
    if (!editText.trim()) return;

    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        ...todo,
        title: editText
      });
      todos = todos.map(t => t.id === todo.id ? updatedTodo : t);
      editingId = null;
      editText = '';
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  $: filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
</script>

<div class="container">
  <div class="header">
    <h1>Todo App</h1>
    <p>Manage your tasks efficiently</p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="task-form">
    <div class="d-flex gap-2">
      <input
        type="text"
        bind:value={newTodo}
        class="form-control"
        placeholder="Add a new task..."
      />
      <button type="submit" class="btn btn-primary">Add Task</button>
    </div>
  </form>

  <div class="filter-buttons">
    <button
      class="btn"
      class:active={filter === 'all'}
      on:click={() => filter = 'all'}
    >
      All
    </button>
    <button
      class="btn"
      class:active={filter === 'active'}
      on:click={() => filter = 'active'}
    >
      Active
    </button>
    <button
      class="btn"
      class:active={filter === 'completed'}
      on:click={() => filter = 'completed'}
    >
      Completed
    </button>
  </div>

  <ul class="list-group task-list">
    {#if filteredTodos.length === 0}
      <li class="list-group-item empty-state">
        <i class="bi bi-clipboard-check"></i>
        <p>No tasks found</p>
      </li>
    {:else}
      {#each filteredTodos as todo (todo.id)}
        <li class="list-group-item d-flex align-items-center gap-3">
          <input
            type="checkbox"
            class="form-check-input"
            checked={todo.completed}
            on:change={() => toggleTodo(todo)}
          />
          <div class="flex-grow-1" role="button" on:dblclick={() => startEditing(todo)}>
            {#if editingId === todo.id}
              <input
                type="text"
                class="form-control"
                bind:value={editText}
                on:blur={() => handleEdit(todo)}
                on:keydown={(e) => e.key === 'Enter' && handleEdit(todo)}
                autofocus
              />
            {:else}
              <span class:form-check-label={true} class:text-decoration-line-through={todo.completed}>
                {todo.title}
              </span>
            {/if}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" on:click={() => startEditing(todo)} aria-label="Edit task">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteTodo(todo.id)} aria-label="Delete task">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header {
    text-align: center;
    margin: 0 0 1.5rem 0;
    padding-top: 0.5rem;
  }

  .header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
    background: linear-gradient(to right, var(--primary-color), var(--primary-hover));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header p {
    color: var(--text-light);
    font-size: 1.1rem;
  }

  .task-form {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: var(--shadow);
    margin-bottom: 2rem;
    transition: transform 0.2s ease;
  }

  .task-form:hover {
    transform: translateY(-2px);
  }

  .task-form .form-control {
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .task-form .form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .task-form .btn {
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }

  .task-form .btn-primary {
    background: var(--primary-color);
    border: none;
  }

  .task-form .btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .task-list {
    background: var(--card-bg);
    border-radius: 1rem;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .task-list .list-group-item {
    border: none;
    border-bottom: 1px solid var(--border-color);
    padding: 1.25rem;
    transition: all 0.2s ease;
  }

  .task-list .list-group-item:last-child {
    border-bottom: none;
  }

  .task-list .list-group-item:hover {
    background-color: rgba(99, 102, 241, 0.02);
  }

  .task-list .form-check-input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.25rem;
    border: 2px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .task-list .form-check-input:checked {
    background-color: var(--success-color);
    border-color: var(--success-color);
  }

  .task-list .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .task-list .form-check-label {
    font-size: 1.1rem;
    color: var(--text-color);
    transition: all 0.2s ease;
  }

  .task-list .form-check-input:checked + .form-check-label {
    color: var(--text-light);
    text-decoration: line-through;
  }

  .task-list .btn {
    padding: 0.5rem 1rem;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .task-list .btn-danger {
    background: var(--danger-color);
    border: none;
  }

  .task-list .btn-danger:hover {
    background: var(--danger-hover);
    transform: translateY(-1px);
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-buttons .btn {
    padding: 0.5rem 1rem;
    font-weight: 500;
    border-radius: 0.5rem;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-light);
    transition: all 0.2s ease;
  }

  .filter-buttons .btn:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .filter-buttons .btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-light);
  }

  .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--border-color);
  }

  .empty-state p {
    font-size: 1.1rem;
    margin-bottom: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .task-list .list-group-item {
    animation: fadeIn 0.3s ease-out;
  }

  @media (max-width: 640px) {
    .container {
      margin: 1rem auto;
    }
    
    .header h1 {
      font-size: 2rem;
    }
    
    .task-form {
      padding: 1.5rem;
    }
    
    .filter-buttons {
      flex-wrap: wrap;
    }
  }
</style> 