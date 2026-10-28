<script>
  import PostCard from '#lib/components/PostCard.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Programming — The Monoblogue</title>
  <meta name="description" content="Build notes, current experiments, and other things that are ruining my life." />
</svelte:head>

<section class="page-shell">
  <header class="programming-intro">
    <div>
      <span class="eyebrow">The lab</span>
      <h1>Programming</h1>
      <p class="lede">Build notes, current experiments, and other things that are ruining my life.</p>
    </div>
    <aside class="identity-slip">
      <span class="identity-slip__avatar">TT</span>
      <div><strong>TarTelperion</strong><span>on GitHub</span></div>
    </aside>
  </header>

  <section class="current-project">
    <div>
      <span class="eyebrow">Current project · {data.project.status}</span>
      <h2>{data.project.name}</h2>
      <p>{data.project.summary}</p>
    </div>
    <ul aria-label="Technology stack">
      {#each data.project.stack as item}<li>{item}</li>{/each}
    </ul>
  </section>

  <div class="section-heading">
    <div><span class="eyebrow">Development log</span><h2>Recent updates</h2></div>
  </div>
  <div class="updates-grid">
    {#each data.posts as post, index}<PostCard {post} compact tilt={index % 2 === 0 ? -0.75 : 0.75} />{/each}
  </div>
</section>

<style>
  .programming-intro { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: end; margin-bottom: 5rem; }
  .identity-slip { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem 1.1rem; border: 1px solid var(--ink); background: var(--paper-deep); box-shadow: 5px 5px 0 color-mix(in srgb, var(--ink) 15%, transparent); font-family: var(--sans); font-size: 0.76rem; transform: rotate(1deg); }
  .identity-slip__avatar { display: grid; width: 2.7rem; aspect-ratio: 1; place-items: center; border-radius: 50%; background: var(--green); color: var(--ink-deep); font-weight: 800; }
  .identity-slip div { display: grid; }
  .identity-slip span:last-child { font-size: 0.7rem; opacity: 0.7; }
  .current-project { position: relative; display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 4rem; margin: 0 0 7rem; padding: clamp(2rem, 5vw, 4.5rem); border: 4px double var(--ink); background: repeating-linear-gradient(0deg, transparent 0 2rem, color-mix(in srgb, var(--ink) 8%, transparent) 2rem calc(2rem + 1px)), var(--green-soft); box-shadow: 12px 13px 0 color-mix(in srgb, var(--ink) 20%, transparent); transform: rotate(-0.45deg); }
  .current-project::after { content: 'open file'; position: absolute; top: -1.4rem; right: 2rem; padding: 0.3rem 0.8rem; border: 1px solid var(--line); background: var(--paper-deep); color: var(--ink); font-family: var(--sans); font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; transform: rotate(2deg); }
  .current-project p { max-width: 43rem; font-size: 1.18rem; }
  .current-project ul { align-self: center; margin: 0; padding: 0; list-style: none; font-family: var(--sans); font-size: 0.8rem; }
  .current-project li { padding: 0.45rem 0; border-bottom: 1px solid var(--line); }
  .updates-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  @media (max-width: 700px) { .programming-intro, .current-project { grid-template-columns: 1fr; } .identity-slip { justify-self: start; } .current-project { transform: rotate(-0.2deg); } .updates-grid { grid-template-columns: 1fr; } }
</style>
