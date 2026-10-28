import { unsubscribe } from '#lib/server/subscribers.js';

export const prerender = false;

export function load({ url }) {
  return {
    unsubscribed: unsubscribe(url.searchParams.get('id') || '', url.searchParams.get('signature') || '')
  };
}
