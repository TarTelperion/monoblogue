<script>
  import { resolve } from '$app/paths';

  let { data } = $props();
</script>
<svelte:head><title>Subscription confirmation — The Monoblogue</title></svelte:head>
<section class="narrow-shell status-page">
  <span class="status-mark" aria-hidden="true">{data.confirmed ? '✓' : '?'}</span>
  <span class="eyebrow">Correspondence desk</span>
  <h1>{data.confirmed ? 'You are on the list.' : 'That invitation has expired.'}</h1>
  <p class="lede">{data.confirmed ? 'The shelves will write when something matching your interests appears.' : 'Return home and request a fresh confirmation note.'}</p>
  <a class="button" href={resolve('/')}>Return home</a>
</section>
<style>.status-page { text-align: center; }.status-mark { display: grid; width: 7rem; aspect-ratio: 1; margin: 0 auto 2rem; place-items: center; border-radius: 50%; background: var(--green); color: var(--ink-deep); font-size: 3rem; }.status-page h1 { font-size: clamp(2.8rem, 8vw, 6rem); }.status-page .lede { margin-inline: auto; }</style>
