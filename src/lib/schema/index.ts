import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, blob, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  phone: text('phone'),
  country: text('country').notNull().default('Unknown'),
  browser: text('browser').notNull().default('Unknown'),
  deviceInfo: text('device_info'),
  credits: real('credits').notNull().default(0),
  walletBalance: real('wallet_balance').notNull().default(0),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  phoneVerified: integer('phone_verified', { mode: 'boolean' }).notNull().default(false),
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
  status: text('status', { enum: ['active', 'suspended', 'deleted'] }).notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Website files
export const websiteFiles = sqliteTable('website_files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  websiteId: integer('website_id').notNull().references(() => hostedWebsites.id),
  path: text('path').notNull(),
  content: blob('content').notNull(),
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
  description: text('description'),
  logoUrl: text('logo_url'),
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

// Wallets
export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  balance: real('balance').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Voice trunks (Bird.com SIP)
export const voiceTrunks = sqliteTable('voice_trunks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  trunkId: text('trunk_id').notNull(),
  name: text('name').notNull(),
  sipUrl: text('sip_url').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Email templates
export const emailTemplates = sqliteTable('email_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Email campaigns
export const emailCampaigns = sqliteTable('email_campaigns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  templateId: integer('template_id').references(() => emailTemplates.id),
  subject: text('subject').notNull(),
  status: text('status', { enum: ['draft', 'sent', 'scheduled'] }).notNull().default('draft'),
  sentCount: integer('sent_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// AI Projects (Crypto/NFT)
export const aiProjects = sqliteTable('ai_projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['crypto', 'nft', 'web3'] }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  backgroundUrl: text('background_url'),
  pages: text('pages', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Site settings
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  backgroundUrl: text('background_url'),
  siteName: text('site_name').notNull().default('Exoincs'),
  primaryColor: text('primary_color').notNull().default('#3B82F6'),
  secondaryColor: text('secondary_color').notNull().default('#10B981'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Webhooks
export const webhooks = sqliteTable('webhooks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  url: text('url').notNull(),
  events: text('events', { mode: 'json' }).notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Subscriptions
export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  plan: text('plan').notNull(),
  status: text('status').notNull(),
  amount: real('amount').notNull(),
  currentPeriodStart: integer('current_period_start').notNull(),
  currentPeriodEnd: integer('current_period_end').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Transactions
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  amount: real('amount').notNull(),
  description: text('description'),
  status: text('status').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  customDomains: many(customDomains),
  shortenedUrls: many(shortenedUrls),
  smsCampaigns: many(smsCampaigns),
  hostedWebsites: many(hostedWebsites),
  telegramBots: many(telegramBots),
  subscriptions: many(subscriptions),
  transactions: many(transactions),
}));

export const customDomainsRelations = relations(customDomains, ({ one }) => ({
  user: one(users, { fields: [customDomains.userId], references: [users.id] }),
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

export const telegramBotsRelations = relations(telegramBots, ({ one }) => ({
  user: one(users, { fields: [telegramBots.userId], references: [users.id] }),
}));

export const botCommandsRelations = relations(botCommands, ({ one }) => ({
  bot: one(telegramBots, { fields: [botCommands.botId], references: [telegramBots.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));
