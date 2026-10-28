<script>
  import { resolve } from '$app/paths';
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
      <a class="button" href={resolve('/library')}>Enter the library</a>
      <a class="button button--quiet" href={resolve('/void')}>Ignore the catalogue</a>
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
    <a href={resolve('/library')}>Browse everything</a>
  </div>
  <div class="card-grid">
    {#each data.featured as post, index}
      <PostCard {post} tilt={index % 2 === 0 ? -0.55 : 0.55} />
    {/each}
  </div>
</section>

<section class="void-invitation">
  <div class="void-invitation__specimen" aria-hidden="true">
    <svg viewBox="0 0 480 360" preserveAspectRatio="none">
      <defs>
        <filter id="home-void-breath" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.013" numOctaves="2" seed="17" result="living-noise">
            <animate attributeName="baseFrequency" values="0.008 0.013;0.011 0.009;0.008 0.013" dur="18s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="living-noise" scale="5" xChannelSelector="R" yChannelSelector="B">
            <animate attributeName="scale" values="3;7;3" dur="12s" repeatCount="indefinite" />
          </feDisplacementMap>
        </filter>
      </defs>
      <g class="specimen-cells" filter="url(#home-void-breath)">
        <path class="specimen-cell specimen-cell--rose" d="M480 0 C480 54.74 480 127.72 480 182.45 C433.66 175.33 371.32 176.03 324.71 173.96 C310.53 122.73 296.32 53.84 302.99 0 C356.09 -8.6 426.9 2.26 480 0 Z" />
        <path class="specimen-cell specimen-cell--green" d="M0 0 C46.2 -15.18 107.81 -9.9 154.01 0 C147.41 63.1 178.43 139.17 194.07 197.77 C182.01 210.01 161.16 218.09 146.28 225.46 C95.02 210.99 41.06 167.96 0 136.68 C0 95.67 0 41 0 0 Z" />
        <path class="specimen-cell specimen-cell--paper" d="M302.99 0 C296.32 53.84 310.53 122.73 324.71 173.96 C302.91 175.75 289.01 196.19 279.17 212.22 C251.92 218.03 221.16 192.9 194.07 197.77 C178.43 139.17 147.41 63.1 154.01 0 C198.71 0 258.3 0 302.99 0 Z" />
        <path class="specimen-cell specimen-cell--gold" d="M0 360 C0 293 0 203.67 0 136.68 C41.06 167.96 95.02 210.99 146.28 225.46 C129.87 265.73 99.94 316.19 92.38 360 C64.66 374.95 27.71 353.97 0 360 Z" />
        <path class="specimen-cell specimen-cell--rose" d="M92.38 360 C99.94 316.19 129.87 265.73 146.28 225.46 C161.16 218.09 182.01 210.01 194.07 197.77 C221.16 192.9 251.92 218.03 279.17 212.22 C279.32 258.77 306.9 314.67 312.48 360 C246.45 360 158.41 360 92.38 360 Z" />
        <path class="specimen-cell specimen-cell--green" d="M480 360 C429.75 367.66 362.74 352.78 312.48 360 C306.9 314.67 279.32 258.77 279.17 212.22 C289.01 196.19 302.91 175.75 324.71 173.96 C371.32 176.03 433.66 175.33 480 182.45 C480 235.72 480 306.74 480 360 Z" />
      </g>
    </svg>
    <span>six cells from an infinite, badly indexed organism</span>
  </div>
  <div>
    <span class="eyebrow">When order becomes suspicious</span>
    <h2>There is always<br />The Void.</h2>
    <p>Every published thought is in there somewhere, growing like mold in a refrigerator. No shelves, no proper sequence, no guarantee you will find what you entered for.</p>
    <a class="button" href={resolve('/void')}>Get pleasantly lost</a>
  </div>
</section>

<div class="subscribe-wrap">
  <SubscribeForm categories={data.categories} />
</div>

<style>
  .void-invitation { position: relative; display: grid; grid-template-columns: minmax(280px, 0.95fr) minmax(300px, 1.05fr); gap: 7vw; align-items: center; width: min(1120px, 92vw); margin: 4rem auto 10rem; padding: clamp(2rem, 6vw, 6rem); border: 4px double var(--void-fg); outline: 1px solid var(--void-fg); outline-offset: 7px; background: radial-gradient(circle at 12% 22%, color-mix(in srgb, var(--green-soft) 22%, transparent), transparent 24rem), var(--void-bg); color: var(--void-fg); overflow: hidden; box-shadow: 12px 14px 0 color-mix(in srgb, var(--green) 22%, transparent); }
  .void-invitation::after { content: 'LIVING INDEX'; position: absolute; right: 1.5rem; top: 1.5rem; padding: 0.25rem 0.6rem; border: 2px solid var(--rose); color: var(--rose); font-family: var(--sans); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em; transform: rotate(4deg); }
  .void-invitation h2 { color: var(--void-fg); }
  .void-invitation p { max-width: 38rem; margin-bottom: 2rem; }
  .void-invitation .button { border-color: var(--void-fg); background: var(--void-fg); color: var(--void-bg); }
  .void-invitation__specimen { position: relative; aspect-ratio: 4 / 3; min-height: 280px; overflow: hidden; border: 4px double var(--void-fg); background: var(--paper-deep); box-shadow: 8px 9px 0 color-mix(in srgb, var(--ink) 18%, transparent); transform: rotate(-1.2deg); }
  .void-invitation__specimen svg { display: block; width: 100%; height: 100%; }
  .void-invitation__specimen > span { position: absolute; right: 0.8rem; bottom: 0.55rem; z-index: 2; max-width: 15rem; color: color-mix(in srgb, var(--void-fg) 60%, transparent); font-size: 0.66rem; font-style: italic; text-align: right; }
  .specimen-cell { stroke: color-mix(in srgb, var(--green) 60%, var(--ink)); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; animation: specimen-pulse 9s ease-in-out infinite alternate; }
  .specimen-cell:nth-child(2n) { animation-delay: -3s; animation-duration: 11s; }
  .specimen-cell:nth-child(3n) { animation-delay: -6s; animation-duration: 13s; }
  .specimen-cell--rose { fill: color-mix(in srgb, var(--rose-soft) 58%, var(--paper)); }
  .specimen-cell--green { fill: color-mix(in srgb, var(--green-soft) 72%, var(--paper)); }
  .specimen-cell--gold { fill: color-mix(in srgb, var(--gold) 34%, var(--paper)); }
  .specimen-cell--paper { fill: color-mix(in srgb, var(--ink) 14%, var(--paper)); }
  @keyframes specimen-pulse { from { fill-opacity: 0.82; } to { fill-opacity: 1; } }
  @media (max-width: 760px) { .void-invitation { grid-template-columns: 1fr; } .void-invitation__specimen { min-height: 240px; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .specimen-cells { filter: none; } .specimen-cell { animation: none; } }
</style>
