"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ShortenedURL {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
}

export default function UrlShortenerPage() {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [domainStatus, setDomainStatus] = useState<"idle" | "checking" | "verified" | "failed">("idle");
  const [domainMessage, setDomainMessage] = useState("");

  useEffect(() => {
    fetch("/api/shorten?userId=1")
      .then((res) => res.json())
      .then((data) => {
        setUrls(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const verifyDomain = async (domain: string) => {
    if (!domain) {
      setDomainStatus("idle");
      setDomainMessage("");
      return;
    }

    setDomainStatus("checking");
    setDomainMessage("Verifying domain...");

    try {
      const res = await fetch("/api/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, userId: 1 }),
      });

      const data = await res.json();

      if (data.verified) {
        setDomainStatus("verified");
        setDomainMessage("Domain verified successfully!");
      } else {
        setDomainStatus("failed");
        setDomainMessage(data.message || "Domain verification failed");
      }
    } catch {
      setDomainStatus("failed");
      setDomainMessage("Failed to verify domain");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalUrl,
        userId: 1,
        customDomain: customDomain || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      alert(`Short URL created: ${data.shortUrl}`);
      setOriginalUrl("");
      setCustomDomain("");
      setDomainStatus("idle");
      setDomainMessage("");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              URL Shortener
            </h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>

          {/* URL Shortener Form */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Short URL
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Original URL
                </label>
                <input
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/long-url"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    setDomainStatus("idle");
                    setDomainMessage("");
                  }}
                  onBlur={() => verifyDomain(customDomain)}
                  placeholder="yourdomain.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {domainStatus !== "idle" && (
                  <div
                    className={`mt-2 text-sm ${
                      domainStatus === "checking"
                        ? "text-yellow-400"
                        : domainStatus === "verified"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {domainStatus === "checking" && (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {domainMessage}
                      </span>
                    )}
                    {domainStatus === "verified" && "✓ " + domainMessage}
                    {domainStatus === "failed" && "✗ " + domainMessage}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Shorten URL
              </button>
            </form>
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                URL History
              </h2>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : urls.length === 0 ? (
                <p className="text-gray-400">No URLs found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Original URL</th>
                        <th className="px-4 py-3">Short Code</th>
                        <th className="px-4 py-3">Clicks</th>
                        <th className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urls.map((url) => (
                        <tr
                          key={url.id}
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 truncate max-w-[200px] sm:max-w-xs">
                            <a
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {url.originalUrl}
                            </a>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {url.shortCode}
                          </td>
                          <td className="px-4 py-3">{url.clicks}</td>
                          <td className="px-4 py-3 text-xs">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
