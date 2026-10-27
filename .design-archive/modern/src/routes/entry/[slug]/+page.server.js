import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '#lib/server/content.js';

export function load({ params }) {
  const post = getPost(params.slug);
  if (!post) error(404, 'Entry not found');
  const peers = getPosts().filter((item) => item.section === post.section);
  const index = peers.findIndex((item) => item.slug === post.slug);
  return {
    post,
    previous: peers[index + 1] || null,
    next: peers[index - 1] || null
  };
}
