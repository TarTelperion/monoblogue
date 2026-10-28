import { getLanguages, getPosts } from '#lib/server/content.js';

export const prerender = true;

export function GET({ url }) {
  const site = process.env.PUBLIC_SITE_URL || url.origin;
  const paths = ['/', '/library', '/programming', '/languages', '/void'];
  paths.push(...getPosts().map((post) => `/entry/${post.slug}`));
  paths.push(...getLanguages().map((language) => `/languages/${language.slug}`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${paths.map((path) => `<url><loc>${site}${path}</loc></url>`).join('')}
  </urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
