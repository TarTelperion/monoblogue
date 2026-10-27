import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentRoot = path.resolve(process.cwd(), 'content');
const postsRoot = path.join(contentRoot, 'posts');

marked.use({
  gfm: true,
  breaks: false
});

const asArray = (value) => {
  if (Array.isArray(value)) return value.map(String);
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
};

export function normalizePost(data, body, filename = '') {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const post = {
    title: String(data.title ?? 'Untitled'),
    slug: String(data.slug ?? filename.replace(/\.md$/, '')),
    summary: String(data.summary ?? ''),
    published: String(data.published ?? ''),
    updated: data.updated ? String(data.updated) : '',
    status: String(data.status ?? 'draft'),
    section: String(data.section ?? 'library'),
    categories: asArray(data.categories),
    languages: asArray(data.languages),
    featured: Boolean(data.featured),
    featuredOrder: Number(data.featuredOrder ?? 0),
    hero: data.hero ? String(data.hero) : '',
    void: {
      weight: Math.max(1, Math.min(5, Number(data.void?.weight ?? 2))),
      accent: String(data.void?.accent ?? 'ink')
    },
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
    body,
    html: marked.parse(body)
  };

  return post;
}

export function validatePost(post) {
  const errors = [];
  if (!post.title || post.title === 'Untitled') errors.push('title is required');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) errors.push('slug must be lowercase kebab-case');
  if (!post.summary) errors.push('summary is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.published)) errors.push('published must use YYYY-MM-DD');
  if (!['library', 'programming', 'language'].includes(post.section)) errors.push('section is invalid');
  if (!['draft', 'published'].includes(post.status)) errors.push('status must be draft or published');
  return errors;
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, filename), 'utf8'));
}

export function getCategories() {
  return readJson('categories.json');
}

export function getLanguages() {
  return readJson('languages.json');
}

export function getProject() {
  return readJson('project.json');
}

export function getPosts({ includeDrafts = false } = {}) {
  if (!fs.existsSync(postsRoot)) return [];

  return fs
    .readdirSync(postsRoot)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const source = fs.readFileSync(path.join(postsRoot, filename), 'utf8');
      const { data, content } = matter(source);
      return normalizePost(data, content, filename);
    })
    .filter((post) => includeDrafts || post.status === 'published')
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getPost(slug) {
  return getPosts().find((post) => post.slug === slug);
}

export function getFeaturedPosts() {
  return getPosts()
    .filter((post) => post.featured && post.section !== 'programming')
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}
