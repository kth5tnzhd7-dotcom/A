import Link from "next/link";

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/auth/signup",
      desc: "Create a new user account",
      body: "{ name, email, password }",
    },
    {
      method: "POST",
      path: "/api/auth/login",
      desc: "Sign in and get JWT token",
      body: "{ email, password }",
    },
    {
      method: "POST",
      path: "/api/shorten",
      desc: "Create a short URL",
      body: "{ originalUrl, userId, customDomain? }",
    },
    {
      method: "GET",
      path: "/api/shorten?userId=1",
      desc: "Get all shortened URLs for a user",
    },
    {
      method: "POST",
      path: "/api/sms/campaigns",
      desc: "Create SMS campaign via Bird.com",
      body: "{ name, senderId, message, recipients[], userId }",
    },
    {
      method: "POST",
      path: "/api/hosting/websites",
      desc: "Host a new website",
      body: "{ name, subdomain, userId }",
    },
    {
      method: "POST",
      path: "/api/telegram/bots",
      desc: "Create Telegram bot",
      body: "{ name, botUsername, token, userId }",
    },
    {
      method: "POST",
      path: "/api/verify-domain",
      desc: "Verify custom domain with DNS check",
      body: "{ domain, userId }",
    },
    {
      method: "GET",
      path: "/api/stats?userId=1",
      desc: "Get real-time stats and activity",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">API Documentation</h1>

        <div className="space-y-6">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    ep.method === "GET"
                      ? "bg-green-900 text-green-300"
                      : "bg-blue-900 text-blue-300"
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-blue-400 font-mono text-sm">{ep.path}</code>
              </div>
              <p className="text-gray-300 mb-2">{ep.desc}</p>
              {ep.body && (
                <div className="bg-gray-900 rounded p-3 mt-3">
                  <p className="text-xs text-gray-400 mb-1">Request Body:</p>
                  <code className="text-green-400 text-sm">{ep.body}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
