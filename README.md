# SaaS Platform - Multi-Service Platform

A comprehensive SaaS platform providing URL shortening, bulk SMS, website hosting, and Telegram bot hosting services with custom domain support.

## Features

### 🔗 URL Shortener
- Create shortened URLs with custom aliases
- Support for custom domains (e.g., go.yourbrand.com)
- Click tracking and analytics
- Link expiration dates
- QR code generation

### 📱 Bulk SMS Service
- Send bulk SMS campaigns to thousands of recipients
- Schedule campaigns for later delivery
- Real-time delivery tracking
- Cost calculation and billing
- CSV/TXT contact list upload
- Country-specific sender IDs

### 🌐 Website Hosting
- Host static websites with custom domains
- File management (upload/download)
- Bandwidth and storage tracking
- SSL certificate support
- Subdomain and custom domain options
- Real-time analytics dashboard

### 🤖 Telegram Bot Hosting
- Create and manage multiple Telegram bots
- Custom webhook configuration
- Bot command management
- Message history tracking
- Custom domain support for bot webhooks
- Automated bot status monitoring

## Technology Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **SMS**: Twilio API
- **Deployment**: Vercel-ready
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React
- **Charts**: Recharts

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   └── layout.tsx        # Dashboard layout
│   │   └── layout.tsx
│   ├── api/
│   │   ├── shorten/
│   │   │   └── route.ts          # URL shortener API
│   │   ├── sms/
│   │   │   └── campaigns/
│   │   │       └── route.ts      # SMS campaigns API
│   │   ├── hosting/
│   │   │   └── websites/
│   │   │       └── route.ts      # Website hosting API
│   │   └── telegram/
│   │       └── bots/
│   │           └── route.ts      # Telegram bot API
│   ├── page.tsx                  # Landing page
│   └── layout.tsx
├── components/
│   ├── UrlShortener.tsx          # URL shortener UI
│   ├── sms/
│   │   └── BulkSMS.tsx           # Bulk SMS UI
│   ├── hosting/
│   │   └── WebsiteHosting.tsx    # Website hosting UI
│   └── telegram-bot/
│       └── TelegramBot.tsx       # Telegram bot UI
└── lib/
    ├── db/
    │   └── index.ts              # Database connection
    └── schema/
        └── index.ts              # Database schema
```

## Database Schema

The platform uses SQLite with Drizzle ORM for type-safe database operations:

- **Users**: User accounts with credits and subscription info
- **Custom Domains**: Domain verification and SSL configuration
- **Shortened URLs**: URL mapping with click analytics
- **SMS Campaigns**: Bulk messaging campaigns with tracking
- **Hosted Websites**: Static site hosting with bandwidth tracking
- **Telegram Bots**: Bot management with command configuration
- **Billing**: Subscription and transaction management

## API Endpoints

### URL Shortener
- `POST /api/shorten` - Create shortened URL
- `GET /api/shorten?userId={id}` - Get user's shortened URLs

### SMS Campaigns
- `POST /api/sms/campaigns` - Create SMS campaign
- `GET /api/sms/campaigns?userId={id}` - Get user's campaigns

### Website Hosting
- `POST /api/hosting/websites` - Create hosted website
- `GET /api/hosting/websites?userId={id}` - Get user's websites

### Telegram Bots
- `POST /api/telegram/bots` - Create Telegram bot
- `GET /api/telegram/bots?userId={id}` - Get user's bots

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run database migrations:
   ```bash
   bun run drizzle-kit generate
   ```

5. Start development server:
   ```bash
   bun dev
   ```

## Environment Variables

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
DATABASE_URL=./data.db
DEFAULT_SHORT_DOMAIN=https://short.ly
```

## Usage

### URL Shortening
1. Navigate to URL Shortener dashboard
2. Enter the long URL to shorten
3. Optionally select a custom domain
4. Click "Shorten URL" and copy the result

### Bulk SMS
1. Go to Bulk SMS section
2. Upload a CSV file with phone numbers
3. Compose your message
4. Schedule or send immediately
5. Track delivery status in real-time

### Website Hosting
1. Visit Website Hosting dashboard
2. Drag and drop your static files
3. Configure custom domain (optional)
4. Deploy and get your live URL
5. Monitor bandwidth and storage usage

### Telegram Bot
1. Create a new bot with BotFather
2. Enter bot token in the platform
3. Configure custom domain for webhooks
4. Add custom commands and responses
5. Test your bot in the built-in chat

## Custom Domain Setup

1. Add your domain in the respective service
2. Configure DNS records (CNAME or A record)
3. Wait for verification
4. Enable SSL (automatic or manual)
5. Start using your custom domain

## Billing & Credits

- Pay-as-you-go pricing model
- Credits deducted per service usage
- Top-up credits via Stripe integration
- Real-time usage tracking
- Monthly subscription plans available

## Security Features

- JWT-based authentication
- Role-based access control
- HTTPS enforcement
- SQL injection protection via ORM
- Rate limiting on API endpoints
- Domain verification system

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please visit our GitHub repository or contact support@saasplatform.dev