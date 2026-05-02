"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-white">
                Exoincs
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/url-shortener" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  URL Shortener
                </Link>
                <Link href="/bulk-sms" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Bulk SMS
                </Link>
                <Link href="/website-hosting" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Website Hosting
                </Link>
                <Link href="/telegram-bot" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Telegram Bot
                </Link>
                <Link href="/blogs" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Blogs
                </Link>
                <Link href="/api-docs" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  API Docs
                </Link>
                <Link href="/privacy" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-400">
                  Terms
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm">
              Sign Up
            </Link>
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/url-shortener" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              URL Shortener
            </Link>
            <Link href="/bulk-sms" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Bulk SMS
            </Link>
            <Link href="/website-hosting" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Website Hosting
            </Link>
            <Link href="/telegram-bot" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Telegram Bot
            </Link>
            <Link href="/blogs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Blogs
            </Link>
            <Link href="/api-docs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              API Docs
            </Link>
            <Link href="/privacy" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Privacy
            </Link>
            <Link href="/terms" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
              Terms
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5 space-x-3">
              <Link href="/login" className="block text-gray-400 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
