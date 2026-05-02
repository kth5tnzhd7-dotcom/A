"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface WebsitePage {
  id: number;
  url: string;
  title: string;
  content: string;
}

export default function WebsiteClonePage() {
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [loading, setLoading] = useState(false);
  const [cloning, setCloning] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const res = await fetch(`/api/website-clone?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.success) {
      setPages([{ id: 1, url: "/", title: "Home", content: data.html }]);
    }
    setLoading(false);
  };

  const cloneWebsite = async () => {
    setCloning(true);
    const res = await fetch("/api/website-clone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, websiteId: 1 }),
    });
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "website-clone.zip";
    link.click();
    setCloning(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white mb-8">Website Clone & Download</h1>

          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Clone Website</h2>
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <button
                onClick={fetchPages}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? "Fetching..." : "Fetch"}
              </button>
            </div>
          </div>

          {pages.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pages Found</h2>
              <div className="space-y-2">
                {pages.map((page) => (
                  <div key={page.id} className="p-3 bg-gray-700 rounded">
                    <span className="font-medium text-white">{page.title}</span>
                    <span className="text-gray-400 ml-2">{page.url}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={cloneWebsite}
                disabled={cloning}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
              >
                {cloning ? "Generating ZIP..." : "Download ZIP"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
