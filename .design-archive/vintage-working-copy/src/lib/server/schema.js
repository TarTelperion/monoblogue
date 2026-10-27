import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable(
  'subscribers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    status: text('status').notNull().default('pending'),
    confirmationTokenHash: text('confirmation_token_hash'),
    confirmationExpiresAt: integer('confirmation_expires_at'),
    confirmedAt: integer('confirmed_at'),
    unsubscribedAt: integer('unsubscribed_at'),
    createdAt: integer('created_at').notNull()
  },
  (table) => [uniqueIndex('subscribers_email_unique').on(table.email)]
);

export const subscriberPreferences = sqliteTable(
  'subscriber_preferences',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subscriberId: integer('subscriber_id').notNull(),
    categorySlug: text('category_slug').notNull()
  },
  (table) => [uniqueIndex('subscriber_category_unique').on(table.subscriberId, table.categorySlug)]
);

export const emailEvents = sqliteTable('email_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  subscriberId: integer('subscriber_id'),
  kind: text('kind').notNull(),
  status: text('status').notNull(),
  detail: text('detail'),
  createdAt: integer('created_at').notNull()
});
