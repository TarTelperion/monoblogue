<script>
  import { onMount } from 'svelte';

  let theme = 'light';

  onMount(() => {
    theme = document.documentElement.dataset.theme || 'light';
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('monoblogue-theme', theme);
  }
</script>

<button class="theme-toggle" type="button" onclick={toggleTheme} aria-label={`Use ${theme === 'dark' ? 'light' : 'dark'} mode`}>
  <span aria-hidden="true">{theme === 'dark' ? '☀' : '◐'}</span>
</button>
