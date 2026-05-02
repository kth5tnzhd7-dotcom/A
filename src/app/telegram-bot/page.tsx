import Link from 'next/link';
import { TelegramBot } from '@/components/telegram-bot/TelegramBot';

export default function TelegramBotPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>
          <TelegramBot />
        </div>
      </div>
    </div>
  );
}