"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function BulkEmailPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [emails, setEmails] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetch("/api/email?userId=1")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.templates || []);
        setCampaigns(data.campaigns || []);
      });
  }, []);

  const createTemplate = async () => {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, name, subject, content }),
    });
    if (res.ok) {
      alert("Template created!");
      setName("");
      setSubject("");
      setContent("");
      window.location.reload();
    }
  };

  const createCampaign = async () => {
    const recipientEmails = emails.split(",").map((e) => e.trim());
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,
        templateId: 1,
        recipientEmails,
      }),
    });
    if (res.ok) {
      alert("Campaign created!");
      setEmails("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Bulk Email Campaigns
          </h1>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
          >
            {showTemplates ? "Hide Templates" : "Show Templates"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Template */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Email Template
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Email content (HTML)"
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <button
                onClick={createTemplate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Create Template
              </button>
            </div>
          </div>

          {/* Send Campaign */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Send Bulk Email
            </h2>
            <div className="space-y-4">
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <button
                onClick={createCampaign}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
              >
                Send Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Templates/Campaigns History */}
        {showTemplates && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Templates</h3>
              <div className="space-y-3">
                {templates.map((t) => (
                  <div key={t.id} className="border border-gray-700 rounded p-3">
                    <h4 className="text-white font-medium">{t.name}</h4>
                    <p className="text-gray-400 text-sm">{t.subject}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Campaigns</h3>
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="border border-gray-700 rounded p-3">
                    <h4 className="text-white font-medium">{c.subject}</h4>
                    <p className="text-gray-400 text-sm">
                      Sent: {c.sentCount} | Status: {c.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
