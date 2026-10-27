import { error } from '@sveltejs/kit';
import { getLanguages, getPosts } from '#lib/server/content.js';

export function load({ params }) {
  const language = getLanguages().find((item) => item.slug === params.language);
  if (!language) error(404, 'Language not found');
  return {
    language,
    posts: getPosts().filter((post) => post.languages.includes(language.slug))
  };
}
