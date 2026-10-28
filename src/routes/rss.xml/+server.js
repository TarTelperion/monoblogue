import { getPosts } from '#lib/server/content.js';

export const prerender = true;

const escapeXml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]);

export function GET({ url }) {
  const site = process.env.PUBLIC_SITE_URL || url.origin;
  const posts = getPosts();
  const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site}/entry/${post.slug}</link>
      <guid>${site}/entry/${post.slug}</guid>
      <pubDate>${new Date(`${post.published}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0"><channel>
    <title>The Monoblogue</title>
    <link>${site}</link>
    <description>A personal library, laboratory, and experimental digital garden.</description>
    ${items}
  </channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
