import { getPosts, getProject } from '#lib/server/content.js';

export function load() {
  return {
    posts: getPosts().filter((post) => post.section === 'programming'),
    project: getProject()
  };
}
