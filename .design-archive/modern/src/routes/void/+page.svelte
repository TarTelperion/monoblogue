<script>
  import { onMount, untrack } from 'svelte';

  let { data } = $props();
  let field;
  let reducedMotion = $state(false);
  let pausedSlug = $state(null);
  const startingPositions = [[69, 22], [50, 62], [82, 49], [47, 33], [73, 77], [31, 72]];
  let bubbles = $state.raw(untrack(() => data.posts.map((post, index) => ({
    post,
    x: startingPositions[index % startingPositions.length][0],
    y: startingPositions[index % startingPositions.length][1],
    dx: (index % 2 ? 1 : -1) * (0.006 + (index % 3) * 0.002),
    dy: (index % 3 ? -1 : 1) * (0.005 + (index % 4) * 0.001)
  }))));

  onMount(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = media.matches;
    if (reducedMotion) return;
    let frame;
    let previous = performance.now();
    const tick = (now) => {
      const delta = Math.min(32, now - previous);
      previous = now;
      bubbles = bubbles.map((bubble) => {
        if (bubble.post.slug === pausedSlug) return bubble;
        let x = bubble.x + bubble.dx * delta;
        let y = bubble.y + bubble.dy * delta;
        let dx = bubble.dx;
        let dy = bubble.dy;
        if (x < 9 || x > 91) { dx *= -1; x = Math.max(9, Math.min(91, x)); }
        if (y < 13 || y > 87) { dy *= -1; y = Math.max(13, Math.min(87, y)); }
        return { ...bubble, x, y, dx, dy };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });

  const accent = (name) => ({ rose: 'var(--rose)', green: 'var(--green)', gold: 'var(--gold)', ink: '#a6afb2' }[name] || 'var(--rose)');
</script>

<svelte:head>
  <title>The Void — The Monoblogue</title>
  <meta name="description" content="Every published thought, drifting without the supervision of a catalogue." />
</svelte:head>

<section class="void-page">
  <header>
    <span class="eyebrow">No catalogue beyond this point</span>
    <h1>The Void</h1>
    <p>Every published thought, drifting without adult supervision. Hover to inspect. Choose one to let it take over.</p>
  </header>
  <div class="void-field" bind:this={field} aria-label="A drifting map of all published entries">
    {#each bubbles as bubble (bubble.post.slug)}
      <a
        class="void-bubble"
        href={`/entry/${bubble.post.slug}`}
        style={`--x:${bubble.x}%;--y:${bubble.y}%;--size:${6.5 + bubble.post.void.weight * 1.9}rem;--accent:${accent(bubble.post.void.accent)}`}
        aria-label={`${bubble.post.title}: ${bubble.post.summary}`}
        onpointerenter={() => pausedSlug = bubble.post.slug}
        onpointerleave={() => pausedSlug = null}
        onfocus={() => pausedSlug = bubble.post.slug}
        onblur={() => pausedSlug = null}
      >
        <span class="void-bubble__type">{bubble.post.section}</span>
        <strong>{bubble.post.title}</strong>
        <span class="void-bubble__summary">{bubble.post.summary}</span>
      </a>
    {/each}
    <span class="void-whisper" aria-hidden="true">nothing is lost, only badly indexed</span>
  </div>
  <details class="void-list">
    <summary>Prefer a list?</summary>
    <ul>{#each data.posts as post}<li><a href={`/entry/${post.slug}`}>{post.title}</a></li>{/each}</ul>
  </details>
</section>

<style>
  .void-page { min-height: calc(100vh - 74px); padding: 2rem 3vw 4rem; background: var(--void-bg); color: var(--void-fg); transition: background 220ms ease, color 220ms ease; }
  .void-page header { position: absolute; z-index: 3; top: 7rem; left: 5vw; max-width: 31rem; pointer-events: none; }
  .void-page h1 { margin-bottom: 0.5rem; color: var(--void-fg); font-size: clamp(3.5rem, 8vw, 7rem); }
  .void-page header p { max-width: 30rem; opacity: 0.78; }
  .void-field { position: relative; min-height: calc(100vh - 7rem); overflow: hidden; border: 1px solid var(--void-line); border-radius: 2rem; background: radial-gradient(circle at 65% 42%, rgba(126, 176, 155, 0.18), transparent 30%), radial-gradient(circle at 35% 76%, rgba(185, 115, 117, 0.15), transparent 33%), var(--void-bg); }
  .void-field::before, .void-field::after { content: ''; position: absolute; width: 18rem; aspect-ratio: 1; border: 1px solid var(--void-line); border-radius: 50%; }
  .void-field::before { right: 11%; top: 8%; }
  .void-field::after { left: 20%; bottom: 5%; width: 30rem; }
  .void-bubble { position: absolute; z-index: 2; left: var(--x); top: var(--y); display: grid; width: var(--size); aspect-ratio: 1; place-content: center; padding: 1.1rem; border: 1px solid color-mix(in srgb, var(--accent) 75%, white); border-radius: 50%; background: color-mix(in srgb, var(--accent) 86%, transparent); color: var(--night); text-align: center; text-decoration: none; transform: translate(-50%, -50%); transition: width 220ms ease, transform 220ms ease, z-index 0s; box-shadow: inset 0 0 2rem rgba(255,255,255,.15), 0 15px 40px rgba(0,0,0,.22); }
  .void-bubble:hover, .void-bubble:focus-visible { z-index: 10; width: calc(var(--size) * 1.55); color: var(--night); transform: translate(-50%, -50%) rotate(1deg); }
  .void-bubble strong { display: block; font-size: clamp(0.78rem, 1.3vw, 1.1rem); line-height: 1.1; }
  .void-bubble__type { font-family: var(--sans); font-size: 0.52rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .void-bubble__summary { display: none; margin-top: 0.5rem; font-size: 0.68rem; line-height: 1.25; }
  .void-bubble:hover .void-bubble__summary, .void-bubble:focus-visible .void-bubble__summary { display: block; }
  .void-whisper { position: absolute; right: 3rem; bottom: 2rem; color: color-mix(in srgb, var(--void-fg) 38%, transparent); font-size: 0.8rem; font-style: italic; }
  .void-list { width: min(42rem, 90vw); margin: 1.5rem auto 0; font-family: var(--sans); font-size: 0.8rem; }
  .void-list summary { cursor: pointer; }
  .void-list ul { columns: 2; }
  @media (max-width: 700px) {
    .void-page header { position: relative; top: auto; left: auto; padding: 2rem 1rem; }
    .void-field { min-height: 42rem; }
    .void-bubble { --size: 7rem !important; }
    .void-bubble:hover, .void-bubble:focus-visible { width: 9.5rem; }
    .void-list ul { columns: 1; }
  }
  @media (prefers-reduced-motion: reduce) { .void-bubble { transition: none; } }
</style>
