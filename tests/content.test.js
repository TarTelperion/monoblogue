import assert from 'node:assert/strict';
import test from 'node:test';
import { getFeaturedPosts, getPosts, normalizePost, validatePost } from '../src/lib/server/content.js';

test('published posts have unique valid slugs', () => {
  const posts = getPosts();
  assert.ok(posts.length > 0);
  assert.equal(new Set(posts.map((post) => post.slug)).size, posts.length);
  for (const post of posts) assert.deepEqual(validatePost(post), []);
});

test('programming posts never enter the featured home collection', () => {
  assert.equal(getFeaturedPosts().some((post) => post.section === 'programming'), false);
});

test('normalization supplies safe display defaults', () => {
  const post = normalizePost({ title: 'A note', slug: 'a-note', summary: 'Summary', published: '2026-10-26', status: 'published', section: 'library' }, 'one two three');
  assert.equal(post.readingMinutes, 1);
  assert.deepEqual(post.categories, []);
  assert.equal(post.void.weight, 2);
});
