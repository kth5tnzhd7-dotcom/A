import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, blob, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  credits: real('credits').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Custom domains
export const customDomains = sqliteTable('custom_domains', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  domain: text('domain').notNull().unique(),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  sslEnabled: integer('ssl_enabled', { mode: 'boolean' }).notNull().default(false),
  serviceType: text('service_type', { enum: ['url_shortener', 'hosting', 'telegram_bot'] }).notNull(),
  serviceId: text('service_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// URL shortener links
export const shortenedUrls = sqliteTable('shortened_urls', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  customDomainId: integer('custom_domain_id').references(() => customDomains.id),
  clicks: integer('clicks').notNull().default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// URL click analytics
export const urlClicks = sqliteTable('url_clicks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  urlId: integer('url_id').notNull().references(() => shortenedUrls.id),
  ip: text('ip'),
  country: text('country'),
  city: text('city'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// SMS campaigns
export const smsCampaigns = sqliteTable('sms_campaigns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  senderId: text('sender_id').notNull(),
  message: text('message').notNull(),
  totalRecipients: integer('total_recipients').notNull(),
  sentCount: integer('sent_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  status: text('status', { enum: ['pending', 'sending', 'completed', 'failed'] }).notNull().default('pending'),
  cost: real('cost').notNull().default(0),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// SMS recipients
export const smsRecipients = sqliteTable('sms_recipients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  campaignId: integer('campaign_id').notNull().references(() => smsCampaigns.id),
  phoneNumber: text('phone_number').notNull(),
  country: text('country'),
  status: text('status', { enum: ['pending', 'sent', 'delivered', 'failed'] }).notNull().default('pending'),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
});

// Hosted websites
export const hostedWebsites = sqliteTable('hosted_websites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  customDomainId: integer('custom_domain_id').references(() => customDomains.id),
  storageUsed: integer('storage_used').notNull().default(0),
  bandwidthUsed: integer('bandwidth_used').notNull().default(0),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Website files
export const websiteFiles = sqliteTable('website_files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  websiteId: integer('website_id').notNull().references(() => hostedWebsites.id),
  path: text('path').notNull(),
  content: blob('content'),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Telegram bots
export const telegramBots = sqliteTable('telegram_bots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  botUsername: text('bot_username').notNull(),
  token: text('token').notNull(),
  chatId: text('chat_id'),
  customDomainId: integer('custom_domain_id').references(() => customDomains.id),
  webhookUrl: text('webhook_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  messagesSent: integer('messages_sent').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Bot commands
export const botCommands = sqliteTable('bot_commands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => telegramBots.id),
  command: text('command').notNull(),
  description: text('description').notNull(),
  response: text('response').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// Billing / Subscriptions
export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  plan: text('plan', { enum: ['free', 'basic', 'pro', 'enterprise'] }).notNull(),
  status: text('status', { enum: ['active', 'cancelled', 'expired'] }).notNull(),
  amount: real('amount').notNull(),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }).notNull(),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Payment transactions
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['purchase', 'refund', 'topup'] }).notNull(),
  amount: real('amount').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shortenedUrls: many(shortenedUrls),
  smsCampaigns: many(smsCampaigns),
  hostedWebsites: many(hostedWebsites),
  telegramBots: many(telegramBots),
  customDomains: many(customDomains),
  subscriptions: many(subscriptions),
  transactions: many(transactions),
}));

export const shortenedUrlsRelations = relations(shortenedUrls, ({ one }) => ({
  user: one(users, { fields: [shortenedUrls.userId], references: [users.id] }),
  customDomain: one(customDomains, { fields: [shortenedUrls.customDomainId], references: [customDomains.id] }),
}));

export const smsCampaignsRelations = relations(smsCampaigns, ({ one, many }) => ({
  user: one(users, { fields: [smsCampaigns.userId], references: [users.id] }),
  recipients: many(smsRecipients),
}));

export const hostedWebsitesRelations = relations(hostedWebsites, ({ one, many }) => ({
  user: one(users, { fields: [hostedWebsites.userId], references: [users.id] }),
  customDomain: one(customDomains, { fields: [hostedWebsites.customDomainId], references: [customDomains.id] }),
  files: many(websiteFiles),
}));