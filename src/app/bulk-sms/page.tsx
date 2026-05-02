"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Campaign {
  id: number;
  name: string;
  message: string;
  totalRecipients: number;
  sentCount: number;
  status: string;
  createdAt: string;
}

export default function BulkSMSPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [name, setName] = useState("");
  const [senderId, setSenderId] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");

  useEffect(() => {
    fetch("/api/sms/campaigns?userId=1")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/sms/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        senderId,
        message,
        recipients: recipients.split(",").map((r) => r.trim()),
        userId: 1,
      }),
    });

    if (res.ok) {
      alert("Campaign created!");
      setName("");
      setSenderId("");
      setMessage("");
      setRecipients("");
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
              Bulk SMS
            </h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>

          {/* Create Campaign Form */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Campaign
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
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
                  Sender ID
                </label>
                <input
                  type="text"
                  required
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipients (comma-separated phone numbers)
                </label>
                <textarea
                  required
                  rows={3}
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="+1234567890, +0987654321"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Create Campaign
              </button>
            </form>
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Campaign History
              </h2>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : campaigns.length === 0 ? (
                <p className="text-gray-400">No campaigns found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Recipients</th>
                        <th className="px-4 py-3">Sent</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-4 py-3">{c.name}</td>
                          <td className="px-4 py-3">{c.totalRecipients}</td>
                          <td className="px-4 py-3">{c.sentCount}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                c.status === "completed"
                                  ? "bg-green-900 text-green-300"
                                  : c.status === "sending"
                                  ? "bg-blue-900 text-blue-300"
                                  : "bg-yellow-900 text-yellow-300"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {new Date(c.createdAt).toLocaleDateString()}
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
