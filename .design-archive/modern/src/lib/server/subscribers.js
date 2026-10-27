import crypto from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { getDatabase } from './db.js';
import { emailEvents, subscriberPreferences, subscribers } from './schema.js';

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function createConfirmationToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, hash: hash(token) };
}

export function createOrRefreshSubscription(email, categorySlugs) {
  const { db, sqlite } = getDatabase();
  const now = Date.now();
  const confirmation = createConfirmationToken();
  const expiresAt = now + 24 * 60 * 60 * 1000;

  const transaction = sqlite.transaction(() => {
    db.insert(subscribers)
      .values({
        email,
        status: 'pending',
        confirmationTokenHash: confirmation.hash,
        confirmationExpiresAt: expiresAt,
        createdAt: now
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          status: 'pending',
          confirmationTokenHash: confirmation.hash,
          confirmationExpiresAt: expiresAt,
          unsubscribedAt: null
        }
      })
      .run();

    const subscriber = db.select().from(subscribers).where(eq(subscribers.email, email)).get();
    db.delete(subscriberPreferences).where(eq(subscriberPreferences.subscriberId, subscriber.id)).run();
    for (const categorySlug of categorySlugs) {
      db.insert(subscriberPreferences).values({ subscriberId: subscriber.id, categorySlug }).run();
    }
    return subscriber;
  });

  return { subscriber: transaction(), token: confirmation.token };
}

export function confirmSubscription(rawToken) {
  const { db } = getDatabase();
  const now = Date.now();
  const subscriber = db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.confirmationTokenHash, hash(rawToken)),
        eq(subscribers.status, 'pending')
      )
    )
    .get();

  if (!subscriber || subscriber.confirmationExpiresAt < now) return null;

  db.update(subscribers)
    .set({
      status: 'active',
      confirmedAt: now,
      confirmationTokenHash: null,
      confirmationExpiresAt: null
    })
    .where(eq(subscribers.id, subscriber.id))
    .run();

  return subscriber;
}

export function unsubscribe(id, signature) {
  const secret = process.env.TOKEN_SECRET;
  if (!secret || secret.length < 16) return false;
  const expected = crypto.createHmac('sha256', secret).update(String(id)).digest('base64url');
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(signature || '');
  if (expectedBytes.length !== actualBytes.length || !crypto.timingSafeEqual(expectedBytes, actualBytes)) return false;

  const { db } = getDatabase();
  const result = db
    .update(subscribers)
    .set({ status: 'unsubscribed', unsubscribedAt: Date.now() })
    .where(eq(subscribers.id, Number(id)))
    .run();
  return result.changes > 0;
}

export function recordEmailEvent(subscriberId, kind, status, detail = '') {
  const { db } = getDatabase();
  db.insert(emailEvents).values({ subscriberId, kind, status, detail, createdAt: Date.now() }).run();
}
