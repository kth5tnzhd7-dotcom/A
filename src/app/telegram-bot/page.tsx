"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Bot {
  id: number;
  name: string;
  botUsername: string;
  isActive: boolean;
  messagesSent: number;
  createdAt: string;
}

export default function TelegramBotPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [name, setName] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [token, setToken] = useState("");

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
    const res = await fetch("/api/telegram/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, botUsername, token, userId: 1 }),
    });

    if (res.ok) {
      alert("Bot created!");
      setName("");
      setBotUsername("");
      setToken("");
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
              Telegram Bot
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Messages</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bots.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-4 py-3">{b.name}</td>
                          <td className="px-4 py-3 font-mono text-xs">
                            @{b.botUsername}
                          </td>
                          <td className="px-4 py-3">{b.messagesSent}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                b.isActive
                                  ? "bg-green-900 text-green-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {b.isActive ? "active" : "inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {new Date(b.createdAt).toLocaleDateString()}
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
