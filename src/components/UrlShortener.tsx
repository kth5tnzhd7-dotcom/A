"use client";

import { useState } from 'react';
import { Link as LinkIcon, Copy, BarChart2, Globe, Check } from 'lucide-react';

export interface ShortenedUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  customDomain?: string;
  clicks: number;
  createdAt: string;
}

export interface UrlShortenerProps {
  urls?: ShortenedUrl[];
  onCreate?: (url: { originalUrl: string; customDomain?: string }) => void;
}

export function UrlShortener({ urls: initialUrls, onCreate }: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>(initialUrls || []);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('create');
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomains] = useState([
    { domain: 'go.myservice.com', verified: true },
    { domain: 'lnk.myservice.com', verified: true },
    { domain: 'promo.myservice.com', verified: false },
  ]);

  const handleCreate = async () => {
    if (!originalUrl.trim()) return;
    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shortCode = Math.random().toString(36).substring(2, 8);
      const newUrl: ShortenedUrl = {
        id: Date.now(),
        originalUrl,
        shortCode,
        customDomain: useCustomDomain && customDomains[0]?.verified ? customDomains[0].domain : undefined,
        clicks: 0,
        createdAt: new Date().toISOString(),
      };
      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
      onCreate?.({ originalUrl, customDomain: newUrl.customDomain });
    } catch (error) {
      console.error('Failed to create short URL:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (shortUrl: string, id: number) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getShortUrl = (url: ShortenedUrl) => {
    return url.customDomain ? `https://${url.customDomain}/${url.shortCode}` : `https://short.ly/${url.shortCode}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">URL Shortener</h2>
        </div>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            New Link
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Long URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-path"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="useCustomDomain"
                checked={useCustomDomain}
                onChange={(e) => setUseCustomDomain(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="useCustomDomain" className="text-sm text-gray-300">
                Use custom domain
              </label>
            </div>

            {useCustomDomain && (
              <div className="mb-4">
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="default">short.ly (default)</option>
                  {customDomains.map((domain, idx) => (
                    <option key={idx} value={domain.domain} disabled={!domain.verified}>
                      {domain.domain} {!domain.verified ? '(unverified)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={isCreating || !originalUrl.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5" />
                  Shorten URL
                </>
              )}
            </button>
          </div>

          {urls.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Recent Links
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {urls.map((url) => {
                  const shortUrl = getShortUrl(url);
                  return (
                    <div
                      key={url.id}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400 truncate">{url.originalUrl}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded text-sm">
                              {shortUrl}
                            </code>
                            <button
                              onClick={() => handleCopy(shortUrl, url.id)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                              {copiedId === url.id ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-500">
                          <span className="flex items-center gap-1">
                            <BarChart2 className="w-4 h-4" />
                            {url.clicks} clicks
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {url.customDomain || 'short.ly'}
                          </span>
                        </div>
                        <span className="text-gray-600">{formatDate(url.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Analytics Overview</h3>
          <p className="text-gray-500">View detailed analytics for all your shortened URLs</p>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {urls.reduce((sum, u) => sum + u.clicks, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Clicks</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{urls.length}</div>
              <div className="text-sm text-gray-400">Links Created</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {urls.filter(u => u.customDomain).length}
              </div>
              <div className="text-sm text-gray-400">Custom Domains</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
