<script>
  import { resolve } from '$app/paths';

  let { data } = $props();
  const returnHref = $derived(
    data.post.section === 'programming'
      ? resolve('/programming')
      : data.post.section === 'language' && data.post.languages[0]
        ? resolve('/languages/[language]', { language: data.post.languages[0] })
        : resolve('/library')
  );
</script>

<svelte:head>
  <title>{data.post.title} — The Monoblogue</title>
  <meta name="description" content={data.post.summary} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.post.title} />
  <meta property="og:description" content={data.post.summary} />
</svelte:head>

<article class="entry">
  <header class="entry-header">
    <a class="back-link" href={returnHref}>← Return to the shelves</a>
    <div class="entry-meta"><span>{data.post.section}</span><time datetime={data.post.published}>{data.post.published}</time><span>{data.post.readingMinutes} minute read</span></div>
    <h1>{data.post.title}</h1>
    <p class="lede">{data.post.summary}</p>
    <div class="tag-row">{#each data.post.categories as category}<span class="tag">{category.replaceAll('-', ' ')}</span>{/each}</div>
  </header>

  <div class="entry-body">{@html data.post.html}</div>

  <nav class="entry-pagination" aria-label="Adjacent entries">
    {#if data.previous}<a href={resolve('/entry/[slug]', { slug: data.previous.slug })}><span>Previous</span><strong>{data.previous.title}</strong></a>{:else}<span></span>{/if}
    {#if data.next}<a href={resolve('/entry/[slug]', { slug: data.next.slug })}><span>Next</span><strong>{data.next.title}</strong></a>{/if}
  </nav>
</article>

<style>
  .entry { width: min(1120px, 92vw); margin: 0 auto; padding: clamp(4rem, 9vw, 8rem) 0; }
  .entry-header { max-width: 900px; margin: 0 auto 5rem; padding-block: 2rem; border-block: 4px double var(--ink); text-align: center; }
  .back-link { display: inline-block; margin-bottom: 4rem; font-family: var(--sans); font-size: 0.76rem; }
  .entry-meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.7rem 1.5rem; margin-bottom: 1.5rem; color: color-mix(in srgb, var(--ink) 72%, transparent); font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .entry h1 { font-size: clamp(3rem, 8vw, 7.2rem); }
  .entry-header .lede { margin-inline: auto; }
  .entry-header .tag-row { justify-content: center; }
  .entry-body { width: min(720px, 100%); margin: 0 auto; font-size: clamp(1.05rem, 1.5vw, 1.18rem); }
  .entry-body :global(p) { margin: 0 0 1.5em; }
  .entry-body :global(p:first-child::first-letter) { float: left; margin: 0.05em 0.12em 0 0; color: var(--rose); font-size: 4.2em; line-height: 0.78; }
  .entry-body :global(h2) { margin-top: 2.5em; font-size: clamp(1.8rem, 3vw, 2.6rem); }
  .entry-body :global(blockquote) { margin: 2.5rem 0; padding: 1.2rem 1.5rem; border: 1px solid var(--ink); border-left: 6px solid var(--rose); background: var(--paper-deep); box-shadow: 5px 5px 0 color-mix(in srgb, var(--ink) 12%, transparent); font-style: italic; }
  .entry-body :global(pre) { overflow-x: auto; padding: 1.2rem; background: var(--ink-deep); color: var(--paper); font-size: 0.85rem; }
  .entry-pagination { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 7rem; padding-top: 2rem; border-top: 1px solid var(--line); }
  .entry-pagination a { display: grid; padding: 1rem; text-decoration: none; }
  .entry-pagination a:last-child { text-align: right; }
  .entry-pagination span { font-family: var(--sans); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; }
  @media (max-width: 600px) { .entry-pagination { grid-template-columns: 1fr; } .entry-pagination a:last-child { text-align: left; } }
</style>
