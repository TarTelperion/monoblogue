<script>
  import PostCard from '#lib/components/PostCard.svelte';
  import SubscribeForm from '#lib/components/SubscribeForm.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>The Monoblogue — a personal digital garden</title>
  <meta name="description" content="A personal library, laboratory, language log, and navigable heap of curiosities." />
</svelte:head>

<section class="hero">
  <div>
    <span class="eyebrow">A library with unreliable shelving</span>
    <h1>The <span>Monoblogue</span></h1>
    <p class="lede">A personal library, laboratory, language log, and navigable heap of curiosities. Please wander. Nothing is due back on time.</p>
    <div class="hero__actions">
      <a class="button" href="/library">Enter the library</a>
      <a class="button button--quiet" href="/void">Ignore the catalogue</a>
    </div>
  </div>
  <aside class="hero__aside">
    <span class="eyebrow">Currently misfiled</span>
    <p><strong>Building this place.</strong></p>
    <p>Trying to give ideas enough structure to find them again, but not enough to keep them still.</p>
  </aside>
</section>

<section class="page-shell" aria-labelledby="featured-heading">
  <div class="section-heading">
    <div>
      <span class="eyebrow">The front table</span>
      <h2 id="featured-heading">Selected from the stacks</h2>
    </div>
    <a href="/library">Browse everything</a>
  </div>
  <div class="card-grid">
    {#each data.featured as post, index}
      <PostCard {post} tilt={index % 2 === 0 ? -0.55 : 0.55} />
    {/each}
  </div>
</section>

<section class="void-invitation">
  <div class="void-invitation__orbit" aria-hidden="true">
    <span>words</span><span>code</span><span>idioms</span><span>crumbs</span>
  </div>
  <div>
    <span class="eyebrow">When order becomes suspicious</span>
    <h2>There is always<br />The Void.</h2>
    <p>Every published thought is in there somewhere, drifting past its neighbors. No shelves, no proper sequence, no guarantee you will find what you entered for.</p>
    <a class="button" href="/void">Get pleasantly lost</a>
  </div>
</section>

<div class="subscribe-wrap">
  <SubscribeForm categories={data.categories} />
</div>

<style>
  .void-invitation { display: grid; grid-template-columns: minmax(280px, 0.9fr) minmax(300px, 1.1fr); gap: 7vw; align-items: center; width: min(1120px, 92vw); margin: 4rem auto 10rem; padding: clamp(2rem, 6vw, 6rem); border-radius: 45% 55% 48% 52% / 57% 42% 58% 43%; background: var(--ink-deep); color: var(--paper); overflow: hidden; }
  .void-invitation h2 { color: var(--paper); }
  .void-invitation p { max-width: 38rem; margin-bottom: 2rem; }
  .void-invitation .button { border-color: var(--paper); background: var(--paper); color: var(--ink-deep); }
  .void-invitation__orbit { position: relative; aspect-ratio: 1; min-height: 300px; }
  .void-invitation__orbit::before { content: ''; position: absolute; inset: 12%; border: 1px solid color-mix(in srgb, var(--paper) 28%, transparent); border-radius: 50%; }
  .void-invitation__orbit span { position: absolute; display: grid; width: 7rem; aspect-ratio: 1; place-items: center; border-radius: 50%; background: var(--rose); color: var(--ink-deep); font-style: italic; }
  .void-invitation__orbit span:nth-child(1) { left: 35%; top: 3%; width: 8rem; }
  .void-invitation__orbit span:nth-child(2) { right: 2%; top: 42%; width: 6rem; background: var(--green); }
  .void-invitation__orbit span:nth-child(3) { bottom: 1%; left: 30%; width: 7rem; background: var(--paper); }
  .void-invitation__orbit span:nth-child(4) { left: 0; top: 42%; width: 5rem; background: var(--gold); }
  @media (max-width: 760px) { .void-invitation { grid-template-columns: 1fr; border-radius: 4rem 1rem 4rem 1rem; } .void-invitation__orbit { min-height: 260px; } }
</style>
