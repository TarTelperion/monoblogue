<script>
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import {
    buildLattice,
    fitBoxToViewport,
    localDateSeed,
    millisecondsUntilLocalMidnight,
    renderLattice
  } from '#lib/void/lattice.js';

  let { data } = $props();
  let field;
  let cells = $state.raw([]);
  let worldDate = $state('');
  let activeCell = $state(null);
  let dimensions = $state({ width: 1200, height: 720 });
  let reducedMotion = false;
  let lattice;

  const accentClass = (accent) => {
    if (['rose', 'green', 'gold', 'ink'].includes(accent)) return `cell--${accent}`;
    return 'cell--ink';
  };

  const heightForWidth = (width) => {
    const minimum = width < 560 ? 760 : width < 820 ? 720 : Math.max(680, window.innerHeight - 116);
    const idealCellArea = width < 560 ? 5600 : width < 820 ? 7200 : 9200;
    const densityHeight = (data.posts.length * idealCellArea) / width;
    return Math.round(Math.min(width < 560 ? 2400 : 1800, Math.max(minimum, densityHeight)));
  };

  const labelWidth = (cell) => Math.max(150, Math.min(270, cell.cellWidth * 1.55));
  const labelHeight = (cell) => Math.max(108, Math.min(168, cell.cellHeight * 1.2));
  const labelBox = (cell) => fitBoxToViewport({
    centerX: cell.siteX,
    centerY: cell.siteY,
    width: labelWidth(cell),
    height: labelHeight(cell),
    viewportWidth: dimensions.width,
    viewportHeight: dimensions.height,
    inset: dimensions.width < 560 ? 14 : 20
  });

  const selectCell = (index) => {
    activeCell = index;
    if (reducedMotion && lattice) {
      cells = renderLattice(lattice, 0, index, index === null ? 0 : 1);
    }
  };

  const regenerate = () => {
    worldDate = localDateSeed();
    if (!data.posts.length) {
      cells = [];
      lattice = null;
      return;
    }
    lattice = buildLattice(data.posts, { ...dimensions, seed: worldDate });
    cells = renderLattice(lattice, 0, null);
  };

  onMount(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      reducedMotion = media.matches;
      if (reducedMotion && lattice) cells = renderLattice(lattice, 0, activeCell, activeCell === null ? 0 : 1);
    };
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.max(320, Math.round(entry.contentRect.width));
      const height = heightForWidth(width);
      if (Math.abs(width - dimensions.width) < 2 && Math.abs(height - dimensions.height) < 2) return;
      dimensions = { width, height };
      regenerate();
    });
    resizeObserver.observe(field);

    let animationFrame;
    let lastFrame = 0;
    let previousTime = performance.now();
    let expandedCell = null;
    let focusStrength = 0;
    const tick = (now) => {
      const delta = Math.min(50, now - previousTime);
      previousTime = now;
      if (activeCell !== null && expandedCell !== activeCell) {
        expandedCell = activeCell;
        focusStrength = 0;
      }
      const focusTarget = activeCell === null ? 0 : 1;
      focusStrength += (focusTarget - focusStrength) * Math.min(1, delta / 115);
      if (activeCell === null && focusStrength < 0.01) {
        focusStrength = 0;
        expandedCell = null;
      }
      if (!reducedMotion && lattice && now - lastFrame > 32) {
        cells = renderLattice(lattice, now, expandedCell, focusStrength);
        lastFrame = now;
      }
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);

    let midnightTimer;
    const scheduleMidnight = () => {
      midnightTimer = window.setTimeout(() => {
        activeCell = null;
        regenerate();
        scheduleMidnight();
      }, millisecondsUntilLocalMidnight() + 50);
    };
    scheduleMidnight();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(midnightTimer);
      resizeObserver.disconnect();
      media.removeEventListener('change', updateMotionPreference);
    };
  });
</script>

<svelte:head>
  <title>The Void — The Monoblogue</title>
  <meta name="description" content="Every published thought joined into a living, dubiously grown map." />
</svelte:head>

<section class="void-page">
  <header class="void-intro">
    <div>
      <span class="eyebrow">No catalogue beyond this point</span>
      <h1>The Void</h1>
      <p>Every published thought belongs to a living membrane. Wander at your own risk; choose a cell to let one entry take over.</p>
    </div>
    <aside class="world-note" aria-label="How this world behaves">
      <span>World seed · {worldDate || 'germinating'}</span>
      <p>The lattice renews at your local midnight. Touch a cell and the surrounding membrane makes room.</p>
    </aside>
  </header>

  <div
    class="void-field"
    bind:this={field}
    style={`--field-height:${dimensions.height}px`}
    aria-label="A cellular map of all published entries"
  >
    {#if cells.length}
      <svg
        class="void-world"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-label="All entries in the void"
        preserveAspectRatio="none"
      >
        {#each cells as cell (cell.post.slug)}
          <a
            class={`cell-link ${accentClass(cell.post.void.accent)}${activeCell === cell.index ? ' cell-link--active' : ''}`}
            href={resolve('/entry/[slug]', { slug: cell.post.slug })}
            aria-label={`${cell.post.title}: ${cell.post.summary}`}
            onpointerenter={() => selectCell(cell.index)}
            onpointerleave={() => selectCell(null)}
            onfocus={() => selectCell(cell.index)}
            onblur={() => selectCell(null)}
          >
            <path class="cell-shape" d={cell.d} />
          </a>
        {/each}
        {#each cells as cell (cell.post.slug)}
            {#if activeCell === cell.index}
              {@const box = labelBox(cell)}
              <foreignObject
                class={`cell-label ${accentClass(cell.post.void.accent)}`}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
              >
                <div class="cell-card">
                  <span class="cell-type">{cell.post.section}</span>
                  <strong>{cell.post.title}</strong>
                  <span class="cell-summary">{cell.post.summary}</span>
                  <span class="cell-meta">{cell.post.readingMinutes} min · {cell.post.published}</span>
                </div>
              </foreignObject>
            {/if}
        {/each}
      </svg>
      <span class="void-whisper" aria-hidden="true">nothing is lost, only organically indexed</span>
    {:else}
      <p class="empty-void">The first cell has not formed yet.</p>
    {/if}
  </div>

  <details class="void-list">
    <summary>Prefer a list?</summary>
    <ul>{#each data.posts as post}<li><a href={resolve('/entry/[slug]', { slug: post.slug })}>{post.title}</a></li>{/each}</ul>
  </details>
</section>

<style>
  .void-page {
    min-height: calc(100vh - 74px);
    padding: clamp(1.25rem, 3vw, 2.75rem) 3vw 4rem;
    background:
      radial-gradient(circle at 78% 4%, color-mix(in srgb, var(--green-soft) 22%, transparent), transparent 25rem),
      var(--void-bg);
    color: var(--void-fg);
    transition: background 220ms ease, color 220ms ease;
  }
  .void-intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 25rem);
    gap: clamp(1.5rem, 5vw, 5rem);
    align-items: end;
    width: min(88rem, 100%);
    margin: 0 auto clamp(1.4rem, 3vw, 2.5rem);
  }
  .void-intro h1 {
    margin: 0.12em 0 0.06em;
    color: var(--void-fg);
    font-size: clamp(3.8rem, 9vw, 8.5rem);
    line-height: 0.86;
  }
  .void-intro > div > p { max-width: 42rem; margin: 0; opacity: 0.78; }
  .world-note {
    padding: 1rem 1.15rem;
    border: 1px solid color-mix(in srgb, var(--void-fg) 36%, transparent);
    background: color-mix(in srgb, var(--paper) 58%, transparent);
    box-shadow: 5px 5px 0 color-mix(in srgb, var(--green) 28%, transparent);
    transform: rotate(0.7deg);
  }
  .world-note span, .cell-type, .cell-meta {
    font-family: var(--sans);
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .world-note p { margin: 0.4rem 0 0; font-size: 0.84rem; line-height: 1.45; }
  .void-field {
    position: relative;
    width: min(92rem, 100%);
    height: var(--field-height);
    margin: 0 auto;
    overflow: hidden;
    border: 4px double color-mix(in srgb, var(--void-fg) 82%, transparent);
    background: var(--paper-deep);
    box-shadow: 0 1.2rem 3.5rem color-mix(in srgb, var(--ink-deep) 14%, transparent);
    isolation: isolate;
  }
  .void-field::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in srgb, var(--ink) 4%, transparent) 3px 4px);
    mix-blend-mode: multiply;
    opacity: 0.38;
  }
  .void-world { display: block; width: 100%; height: 100%; }
  .cell-link {
    --cell-fill: color-mix(in srgb, var(--paper-deep) 78%, var(--ink));
    --cell-ink: var(--ink-deep);
    color: var(--cell-ink);
    cursor: pointer;
    outline: none;
  }
  .cell--rose { --cell-fill: color-mix(in srgb, var(--rose-soft) 58%, var(--paper)); }
  .cell--green { --cell-fill: color-mix(in srgb, var(--green-soft) 72%, var(--paper)); }
  .cell--gold { --cell-fill: color-mix(in srgb, var(--gold) 34%, var(--paper)); }
  .cell--ink { --cell-fill: color-mix(in srgb, var(--ink) 17%, var(--paper)); }
  .cell-shape {
    fill: var(--cell-fill);
    stroke: color-mix(in srgb, var(--green) 58%, var(--ink));
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    transition: fill 180ms ease, filter 180ms ease;
  }
  .cell-link:hover .cell-shape, .cell-link:focus-visible .cell-shape {
    fill: color-mix(in srgb, var(--cell-fill) 76%, var(--paper));
    filter: drop-shadow(0 0 10px color-mix(in srgb, var(--gold) 44%, transparent));
  }
  .cell-link--active .cell-shape { stroke-width: 4.5; }
  .cell-link:focus-visible .cell-shape { stroke: var(--rose); stroke-width: 6; }
  .cell-label { overflow: visible; pointer-events: none; }
  .cell-card {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.9rem;
    border: 1px solid color-mix(in srgb, var(--cell-ink) 28%, transparent);
    background: color-mix(in srgb, var(--cell-fill) 76%, var(--paper));
    color: var(--cell-ink);
    text-align: center;
    box-shadow: 4px 5px 0 color-mix(in srgb, var(--cell-ink) 12%, transparent);
    animation: reveal-cell 160ms ease-out both;
  }
  .cell-card strong {
    display: block;
    max-width: 17rem;
    margin-top: 0.18rem;
    font-size: clamp(0.88rem, 1.45vw, 1.28rem);
    line-height: 1.08;
    text-wrap: balance;
  }
  .cell-summary {
    display: -webkit-box;
    max-width: 17rem;
    margin-top: 0.42rem;
    overflow: hidden;
    font-size: clamp(0.66rem, 0.9vw, 0.78rem);
    line-height: 1.28;
    opacity: 0.78;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  .cell-meta { margin-top: 0.48rem; font-size: 0.5rem; opacity: 0.63; }
  @keyframes reveal-cell {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .void-whisper {
    position: absolute;
    right: 1.3rem;
    bottom: 0.9rem;
    z-index: 4;
    color: color-mix(in srgb, var(--void-fg) 45%, transparent);
    font-size: 0.72rem;
    font-style: italic;
    pointer-events: none;
  }
  .empty-void { display: grid; min-height: 24rem; place-items: center; font-style: italic; }
  .void-list { width: min(42rem, 90vw); margin: 1.5rem auto 0; font-family: var(--sans); font-size: 0.8rem; }
  .void-list summary { cursor: pointer; }
  .void-list ul { columns: 2; }

  @media (max-width: 720px) {
    .void-page { padding-inline: 0.75rem; }
    .void-intro { grid-template-columns: 1fr; padding-inline: 0.65rem; }
    .void-intro h1 { font-size: clamp(4rem, 24vw, 7rem); }
    .world-note { max-width: 28rem; transform: none; }
    .cell-card strong { font-size: clamp(0.82rem, 3.4vw, 1.1rem); }
    .cell-summary { -webkit-line-clamp: 1; line-clamp: 1; }
    .cell-meta { margin-top: 0.34rem; }
    .void-list ul { columns: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cell-shape { transition: none; }
    .cell-card { animation: none; }
  }
</style>
