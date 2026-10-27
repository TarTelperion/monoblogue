import { getCategories, getLanguages, getPosts, validatePost } from '../src/lib/server/content.js';

const posts = getPosts({ includeDrafts: true });
const categories = new Set(getCategories().map((item) => item.slug));
const languages = new Set(getLanguages().map((item) => item.slug));
const slugs = new Set();
const failures = [];

for (const post of posts) {
  for (const error of validatePost(post)) failures.push(`${post.slug}: ${error}`);
  if (slugs.has(post.slug)) failures.push(`${post.slug}: duplicate slug`);
  slugs.add(post.slug);
  for (const category of post.categories) {
    if (!categories.has(category)) failures.push(`${post.slug}: unknown category "${category}"`);
  }
  for (const language of post.languages) {
    if (!languages.has(language)) failures.push(`${post.slug}: unknown language "${language}"`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${posts.length} posts, ${categories.size} categories, and ${languages.size} languages.`);
