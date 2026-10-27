<script>
  let { data } = $props();
</script>

<svelte:head>
  <title>Languages — The Monoblogue</title>
  <meta name="description" content="Progress reports from the long and occasionally grammatical process of learning languages." />
</svelte:head>

<section class="page-shell">
  <header class="page-intro">
    <span class="eyebrow">The translation desk</span>
    <h1>Languages</h1>
    <p class="lede">Progress reports from the long and occasionally grammatical process of learning how other people arrange the world.</p>
  </header>

  <aside class="scale-note">
    <strong>The thoroughly unofficial scale:</strong>
    <span>toddler ≈ A</span><span>passable ≈ B</span><span>decent ≈ C</span><span>bread ≈ transcendence</span>
  </aside>

  <div class="language-grid">
    {#each data.languages as language, index}
      <a class="language-card" href={`/languages/${language.slug}`} style={`--tilt: ${index % 2 ? '1.2deg' : '-1deg'}`}>
        <span class="language-card__glyph" aria-hidden="true">{language.glyph}</span>
        <span class="eyebrow">{language.level} · {language.cefr}</span>
        <h2>{language.name}</h2>
        <p>{language.note}</p>
        <span class="language-card__count">{language.postCount} {language.postCount === 1 ? 'entry' : 'entries'} →</span>
      </a>
    {/each}
  </div>
</section>

<style>
  .page-intro { max-width: 58rem; margin-bottom: 3rem; }
  .scale-note { display: flex; flex-wrap: wrap; gap: 0.65rem 1.5rem; margin-bottom: 4rem; padding: 1rem 1.25rem; border-block: 1px solid var(--line); font-family: var(--sans); font-size: 0.76rem; }
  .scale-note span { opacity: 0.76; }
  .language-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .language-card { position: relative; min-height: 26rem; padding: clamp(1.5rem, 4vw, 3rem); border: 1px solid var(--line); background: color-mix(in srgb, var(--paper) 78%, var(--green-soft)); color: var(--ink); text-decoration: none; transform: rotate(var(--tilt)); overflow: hidden; transition: transform 180ms ease; }
  .language-card:nth-child(3n + 2) { background: color-mix(in srgb, var(--paper) 74%, var(--rose-soft)); }
  .language-card:hover { color: var(--ink); transform: translateY(-6px) rotate(0deg); }
  .language-card__glyph { position: absolute; right: -0.04em; bottom: -0.28em; color: color-mix(in srgb, var(--ink) 9%, transparent); font-size: 18rem; line-height: 1; }
  .language-card h2 { position: relative; margin-top: 6rem; }
  .language-card p { position: relative; max-width: 28rem; }
  .language-card__count { position: absolute; left: clamp(1.5rem, 4vw, 3rem); bottom: 2rem; font-family: var(--sans); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
  @media (max-width: 700px) { .language-grid { grid-template-columns: 1fr; } .language-card { min-height: 22rem; } }
</style>
