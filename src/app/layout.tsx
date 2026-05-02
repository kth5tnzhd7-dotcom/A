import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Platform",
  description: "All-in-one platform for URL shortening, bulk SMS, website hosting, and Telegram bot hosting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation */}
        <nav className="bg-gray-800 border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-white">
                    SaaS Platform
                  </a>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a href="/url-shortener" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      URL Shortener
                    </a>
                    <a href="/bulk-sms" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      Bulk SMS
                    </a>
                    <a href="/website-hosting" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      Website Hosting
                    </a>
                    <a href="/telegram-bot" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      Telegram Bot
                    </a>
                    <a href="/privacy" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      Privacy
                    </a>
                    <a href="/terms" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                      Terms
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-baseline md:ml-6">
                  <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded">
                    Dashboard
                  </a>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button className="inline-flex items-center px-2.5 py-0.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112-3v1zm0 0h6v-1a6 6 0 01-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}