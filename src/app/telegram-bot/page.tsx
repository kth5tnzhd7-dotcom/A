"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Bot {
  id: number;
  name: string;
  botUsername: string;
  token: string;
  isActive: boolean;
  messagesSent: number;
  createdAt: string;
  logo?: string;
  description?: string;
  commands?: { command: string; description: string }[];
  domain?: string;
}

export default function TelegramBotPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [name, setName] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [token, setToken] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [domain, setDomain] = useState("");
  const [commands, setCommands] = useState("");

  useEffect(() => {
    fetch("/api/telegram/bots?userId=1")
      .then((res) => res.json())
      .then((data) => {
        setBots(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const commandsArray = commands
      .split("\n")
      .filter((c) => c.trim())
      .map((c) => {
        const [cmd, ...desc] = c.split(" - ");
        return { command: cmd?.trim(), description: desc.join(" - ").trim() };
      });

    const res = await fetch("/api/telegram/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        botUsername,
        token,
        userId: 1,
        description,
        logo,
        domain,
        commands: commandsArray,
      }),
    });

    if (res.ok) {
      alert("Bot created!");
      setName("");
      setBotUsername("");
      setToken("");
      setDescription("");
      setLogo("");
      setDomain("");
      setCommands("");
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
              Telegram Bot Hosting
            </h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>

          {/* Create Bot Form */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create New Bot
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Username
                </label>
                <input
                  type="text"
                  required
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  placeholder="my_bot"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A bot that helps with..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="bot.yourdomain.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Commands (one per line: cmd - description)
                </label>
                <textarea
                  value={commands}
                  onChange={(e) => setCommands(e.target.value)}
                  placeholder="/start - Start the bot\n/help - Show help"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Create Bot
              </button>
            </form>
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Bot History
              </h2>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : bots.length === 0 ? (
                <p className="text-gray-400">No bots found.</p>
              ) : (
                <div className="space-y-6">
                  {bots.map((b) => (
                    <div
                      key={b.id}
                      className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750"
                    >
                      <div className="flex items-start gap-4">
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt={b.name}
                            className="w-16 h-16 rounded-full bg-gray-600"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xl">
                              {b.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {b.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            @{b.botUsername}
                          </p>
                          {b.description && (
                            <p className="text-gray-300 text-sm mt-2">
                              {b.description}
                            </p>
                          )}
                          {b.domain && (
                            <p className="text-blue-400 text-xs mt-1">
                              Domain: {b.domain}
                            </p>
                          )}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              b.isActive
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {b.isActive ? "active" : "inactive"}
                          </span>
                        </div>
                      </div>
                      {b.commands && b.commands.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Commands:
                          </h4>
                          <div className="space-y-1">
                            {b.commands.map((cmd, idx) => (
                              <div
                                key={idx}
                                className="flex gap-2 text-sm"
                              >
                                <code className="text-blue-400">
                                  {cmd.command}
                                </code>
                                <span className="text-gray-400">
                                  - {cmd.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                        <span>Messages: {b.messagesSent}</span>
                        <span>
                          Created: {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
