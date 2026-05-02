import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">SaaS Platform</h1>
          <p className="text-sm text-gray-400 mt-1">All-in-one service hub</p>
        </div>
        <nav className="mt-6 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/url-shortener"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL Shortener
          </Link>
          <Link
            href="/dashboard/sms"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Bulk SMS
          </Link>
          <Link
            href="/dashboard/hosting"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Website Hosting
          </Link>
          <Link
            href="/dashboard/telegram"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Telegram Bot
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1l-1 4h-4l1-4zm6-10h2a2 2 0 012 2v1h-6V7a2 2 0 012-2zM7 7h2v2H7V7z" />
            </svg>
            Billing
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium text-white">U</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
