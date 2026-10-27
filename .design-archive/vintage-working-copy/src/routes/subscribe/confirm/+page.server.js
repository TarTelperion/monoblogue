import { confirmSubscription } from '#lib/server/subscribers.js';

export function load({ url }) {
  const token = url.searchParams.get('token') || '';
  return { confirmed: token.length > 20 ? Boolean(confirmSubscription(token)) : false };
}
