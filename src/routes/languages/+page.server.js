import { getLanguages, getPosts } from '#lib/server/content.js';

export function load() {
  const posts = getPosts();
  return {
    languages: getLanguages().map((language) => ({
      ...language,
      postCount: posts.filter((post) => post.languages.includes(language.slug)).length
    }))
  };
}
