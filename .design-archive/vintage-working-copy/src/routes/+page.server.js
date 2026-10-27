import { getCategories, getFeaturedPosts, getPosts } from '#lib/server/content.js';

export function load() {
  return {
    featured: getFeaturedPosts(),
    recent: getPosts().filter((post) => post.section !== 'programming').slice(0, 4),
    categories: getCategories()
  };
}
