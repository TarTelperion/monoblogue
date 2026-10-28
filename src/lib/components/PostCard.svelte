<script>
  import { resolve } from '$app/paths';

  let { post, compact = false, tilt = 0 } = $props();
</script>

<article class:compact class="post-card" style={`--card-tilt: ${tilt}deg`}>
  <div class="post-card__meta">
    <span>{post.section === 'library' ? 'From the library' : post.section}</span>
    <time datetime={post.published}>{post.published}</time>
  </div>
  <h3><a href={resolve('/entry/[slug]', { slug: post.slug })}>{post.title}</a></h3>
  <p>{post.summary}</p>
  <div class="post-card__footer">
    <div class="tag-row" aria-label="Categories">
      {#each post.categories.slice(0, compact ? 2 : 3) as category}
        <span class="tag">{category.replaceAll('-', ' ')}</span>
      {/each}
    </div>
    <span>{post.readingMinutes} min</span>
  </div>
</article>
