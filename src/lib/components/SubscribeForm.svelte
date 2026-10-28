<script>
  let { categories = [] } = $props();
</script>

<section
  class="subscribe-form subscribe-form--construction"
  aria-labelledby="library-card-heading"
  aria-describedby="library-card-status"
>
  <div class="construction-tape" aria-hidden="true">
    <span>Desk under construction</span><span>Mind the loose footnotes</span><span>Desk under construction</span>
  </div>

  <div class="subscribe-form__intro">
    <span class="eyebrow">Correspondence desk · temporarily closed</span>
    <h2 id="library-card-heading">Request a library card</h2>
    <p>The machinery for sending notes from the stacks is still being assembled.</p>
  </div>

  <label class="field subscribe-form__email">
    <span>Email address · desk offline</span>
    <input
      type="email"
      name="email"
      autocomplete="off"
      placeholder="not accepting addresses yet"
      disabled
    />
  </label>

  <fieldset class="subscribe-form__preferences" disabled>
    <legend>Planned shelves</legend>
    <label class="check-option"><input type="checkbox" checked /> Everything</label>
    {#each categories as category}
      <label class="check-option"><input type="checkbox" /> {category.label}</label>
    {/each}
  </fieldset>

  <button class="button subscribe-form__actions" type="button" disabled>
    Requests temporarily closed
  </button>

  <div class="construction-note" id="library-card-status" role="status">
    <span>Work order № 001</span>
    <strong>The return chute is currently full of wires.</strong>
    <p>No email address is being collected. Please check back after the correspondence desk passes inspection.</p>
  </div>
</section>

<style>
  .subscribe-form--construction {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    grid-template-columns: minmax(18rem, 1.05fr) minmax(17rem, 0.9fr) minmax(19rem, 1fr);
    grid-template-areas: 'intro email preferences' 'intro actions preferences' 'status status status';
    gap: 1.6rem clamp(1.75rem, 3vw, 3rem);
    padding-top: clamp(4.8rem, 8vw, 6.2rem);
    background:
      repeating-linear-gradient(0deg, transparent 0 1.85rem, color-mix(in srgb, var(--ink) 7%, transparent) 1.85rem calc(1.85rem + 1px)),
      color-mix(in srgb, var(--paper) 79%, var(--green-soft));
  }
  .subscribe-form--construction > :not(.construction-tape) { position: relative; z-index: 1; }
  .subscribe-form__intro { max-width: 31rem; padding-right: clamp(0rem, 2vw, 1.5rem); }
  .subscribe-form__intro h2 { margin-top: 0.55rem; line-height: 0.98; }
  .subscribe-form__intro p { max-width: 29rem; margin-top: 1.25rem; line-height: 1.55; }
  .subscribe-form__email { gap: 0.65rem; }
  .construction-tape {
    position: absolute;
    z-index: 2;
    top: 1.25rem;
    left: -2.5rem;
    display: flex;
    width: calc(100% + 5rem);
    min-height: 2.25rem;
    align-items: center;
    justify-content: space-around;
    gap: 2rem;
    border-block: 1px solid var(--ink-deep);
    background: repeating-linear-gradient(135deg, var(--gold) 0 1rem, var(--paper) 1rem 2rem);
    color: var(--ink-deep);
    font-family: var(--sans);
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transform: rotate(-1.1deg);
  }
  .construction-tape span { padding: 0.2rem 0.45rem; background: color-mix(in srgb, var(--paper) 84%, transparent); white-space: nowrap; }
  .construction-note {
    grid-area: status;
    display: grid;
    grid-template-columns: max-content minmax(15rem, 0.8fr) minmax(20rem, 1.2fr);
    gap: 0.75rem clamp(1.5rem, 3vw, 3rem);
    align-items: center;
    padding: 1.2rem clamp(1.25rem, 2.5vw, 2rem);
    border: 3px double var(--rose);
    background: color-mix(in srgb, var(--paper) 90%, var(--rose-soft));
    box-shadow: 5px 6px 0 color-mix(in srgb, var(--rose) 18%, transparent);
    transform: rotate(-0.45deg);
  }
  .construction-note > span {
    color: var(--rose);
    font-family: var(--sans);
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .construction-note strong { max-width: 22rem; line-height: 1.22; }
  .construction-note p { max-width: 28rem; font-size: 0.82rem; line-height: 1.5; }
  .subscribe-form--construction input:disabled {
    border-style: dashed;
    background: color-mix(in srgb, var(--paper) 62%, var(--green-soft));
    color: var(--ink);
    cursor: not-allowed;
    opacity: 0.72;
  }
  .subscribe-form--construction fieldset:disabled { opacity: 0.58; }
  .subscribe-form--construction .button:disabled {
    border-style: dashed;
    background: color-mix(in srgb, var(--ink) 75%, var(--paper));
    cursor: not-allowed;
    opacity: 0.78;
    transform: rotate(0.6deg);
    white-space: nowrap;
  }

  @media (max-width: 1050px) {
    .subscribe-form--construction {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-areas: 'intro intro' 'email preferences' 'actions preferences' 'status status';
    }
    .construction-note { grid-template-columns: minmax(8rem, 0.4fr) 1fr; }
    .construction-note p { grid-column: 1 / -1; }
  }
  @media (max-width: 600px) {
    .subscribe-form--construction {
      grid-template-columns: 1fr;
      grid-template-areas: 'intro' 'email' 'preferences' 'actions' 'status';
      gap: 1.5rem;
      padding-top: 5.25rem;
    }
    .subscribe-form__intro { padding-right: 0; }
    .construction-tape { justify-content: center; }
    .construction-tape span:not(:first-child) { display: none; }
    .construction-note { grid-template-columns: 1fr; transform: none; }
    .construction-note p { grid-column: auto; }
    .subscribe-form--construction .button:disabled { white-space: normal; }
  }
</style>
