<script>
  import { resolve } from '$app/paths';

  let { data } = $props();
</script>
<svelte:head><title>Unsubscribe — The Monoblogue</title></svelte:head>
<section class="narrow-shell status-page">
  <span class="eyebrow">Correspondence desk</span>
  <h1>{data.unsubscribed ? 'The letters will stop.' : 'This link could not be verified.'}</h1>
  <p class="lede">{data.unsubscribed ? 'You have been unsubscribed. No hard feelings; the library remains open.' : 'The unsubscribe link may be incomplete or expired.'}</p>
  <a class="button" href={resolve('/')}>Return home</a>
</section>
<style>.status-page { text-align: center; }.status-page h1 { font-size: clamp(2.8rem, 8vw, 6rem); }.status-page .lede { margin-inline: auto; }</style>
