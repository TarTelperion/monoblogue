import { getCategories } from '#lib/server/content.js';
import { sendConfirmationEmail } from '#lib/server/email/gmail.js';
import { createOrRefreshSubscription, recordEmailEvent } from '#lib/server/subscribers.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 5;

export async function POST({ request, url, getClientAddress }) {
  const client = getClientAddress();
  const now = Date.now();
  const recent = (attempts.get(client) || []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= maxAttempts) {
    return Response.json({ message: 'Too many notes requested. Please wait a little while.' }, { status: 429 });
  }
  attempts.set(client, [...recent, now]);

  const body = await request.json().catch(() => ({}));
  if (body.website) return Response.json({ message: 'Check your inbox for a confirmation note.' });

  const email = String(body.email || '').trim().toLowerCase();
  if (!emailPattern.test(email) || email.length > 254) {
    return Response.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  const allowed = new Set(['all', ...getCategories().map((category) => category.slug)]);
  const requested = Array.isArray(body.categories) ? body.categories.map(String) : [];
  let categorySlugs = [...new Set(requested.filter((category) => allowed.has(category)))];
  if (!categorySlugs.length) categorySlugs.push('all');
  if (categorySlugs.includes('all')) categorySlugs = ['all'];

  const { subscriber, token } = createOrRefreshSubscription(email, categorySlugs);
  const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
  const confirmUrl = new URL('/subscribe/confirm', baseUrl);
  confirmUrl.searchParams.set('token', token);

  try {
    const result = await sendConfirmationEmail({ to: email, confirmUrl: confirmUrl.toString() });
    recordEmailEvent(subscriber.id, 'confirmation', result.delivered ? 'sent' : 'pending-configuration');
  } catch (error) {
    recordEmailEvent(subscriber.id, 'confirmation', 'failed', error instanceof Error ? error.message : 'Unknown failure');
  }

  return Response.json({ message: 'Check your inbox for a confirmation note.' }, { status: 202 });
}
