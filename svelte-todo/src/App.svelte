<script lang="ts">
  import Todo from './components/Todo.svelte';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
</script>

<main>
  <Todo />
</main>

<style>
  :global(:root) {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --danger-color: #ef4444;
    --danger-hover: #dc2626;
    --success-color: #22c55e;
    --success-hover: #16a34a;
    --text-color: #1f2937;
    --text-light: #6b7280;
    --bg-color: #f9fafb;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.5;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  main {
    padding: 0;
  }
</style>
