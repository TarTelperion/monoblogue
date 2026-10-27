<script>
  let { categories = [] } = $props();
  let submissionState = $state('idle');
  let message = $state('');

  async function subscribe(event) {
    submissionState = 'loading';
    message = '';
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get('email'),
      categories: form.getAll('categories'),
      website: form.get('website')
    };

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      submissionState = response.ok ? 'success' : 'error';
      message = result.message || 'Something went sideways. Please try again.';
      if (response.ok) event.currentTarget.reset();
    } catch {
      submissionState = 'error';
      message = 'The messenger got lost. Please try again.';
    }
  }
</script>

<form class="subscribe-form" onsubmit={(event) => { event.preventDefault(); subscribe(event); }}>
  <div class="subscribe-form__intro">
    <span class="eyebrow">Correspondence desk</span>
    <h2>Notes from the stacks</h2>
    <p>Choose which subjects may occasionally find their way to your inbox.</p>
  </div>

  <label class="field subscribe-form__email">
    <span>Email address</span>
    <input type="email" name="email" autocomplete="email" placeholder="reader@example.com" required />
  </label>

  <fieldset class="subscribe-form__preferences">
    <legend>Send me</legend>
    <label class="check-option"><input type="checkbox" name="categories" value="all" checked /> Everything (uncheck to choose)</label>
    {#each categories as category}
      <label class="check-option"><input type="checkbox" name="categories" value={category.slug} /> {category.label}</label>
    {/each}
  </fieldset>

  <label class="honeypot" aria-hidden="true">
    Website
    <input name="website" tabindex="-1" autocomplete="off" />
  </label>

  <button class="button subscribe-form__actions" type="submit" disabled={submissionState === 'loading'}>
    {submissionState === 'loading' ? 'Sending…' : 'Request a library card'}
  </button>
  <p class="form-status" aria-live="polite">{message}</p>
</form>
