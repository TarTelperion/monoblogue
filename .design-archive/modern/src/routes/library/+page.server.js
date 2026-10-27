import { getCategories, getPosts } from '#lib/server/content.js';

export function load() {
  return {
    posts: getPosts().filter((post) => post.section !== 'programming'),
    categories: getCategories()
  };
}
