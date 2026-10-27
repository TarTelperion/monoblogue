<script>
  import '../app.css';
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';

  let { children } = $props();
  const navigation = [
    ['/', 'Home'],
    ['/library', 'Library'],
    ['/programming', 'Programming'],
    ['/languages', 'Languages'],
    ['/void', 'The Void']
  ];
</script>

<svelte:head>
  <meta name="description" content="The Monoblogue is a personal library, laboratory, and experimental digital garden." />
  <meta property="og:site_name" content="The Monoblogue" />
  <meta property="og:image" content="/monoblogue-card.svg" />
  <link rel="alternate" type="application/rss+xml" title="The Monoblogue" href="/rss.xml" />
</svelte:head>

<a class="skip-link" href="#main">Skip to the shelves</a>
<header class="site-header">
  <a class="wordmark" href="/" aria-label="The Monoblogue, home">
    <span class="wordmark__mark" aria-hidden="true">M</span>
    <span class="wordmark__copy"><strong>The Monoblogue</strong><small>Private miscellany · Est. MMXXVI</small></span>
  </a>
  <nav class="desktop-nav" aria-label="Primary navigation">
    {#each navigation as item}
      <a href={item[0]}>{item[1]}</a>
    {/each}
  </nav>
  <div class="header-actions">
    <ThemeToggle />
    <details class="mobile-menu">
      <summary aria-label="Open navigation">Menu</summary>
      <nav aria-label="Mobile navigation">
        {#each navigation as item}
          <a href={item[0]}>{item[1]}</a>
        {/each}
      </nav>
    </details>
  </div>
</header>

<main id="main">{@render children()}</main>

<footer class="site-footer">
  <p><span aria-hidden="true">※</span> Catalogued imperfectly and revised without warning.</p>
  <nav aria-label="Footer navigation">
    <a href="/rss.xml">RSS</a>
    <a href="/void">Get lost</a>
  </nav>
</footer>
