import { getPosts } from '#lib/server/content.js';

export function load() {
  return { posts: getPosts() };
}
