import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const publicSiteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:5173';

export default defineConfig({
  plugins: [sveltekit({
    adapter: adapter({ strict: false }),
    paths: {
      base: process.env.BASE_PATH || '',
      origin: new URL(publicSiteUrl).origin
    },
    prerender: {
      entries: ['*', '/sitemap.xml']
    }
  })]
});
