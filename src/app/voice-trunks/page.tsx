"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function VoiceTrunksPage() {
  const [trunks, setTrunks] = useState<any[]>([]);
  const [trunkId, setTrunkId] = useState("");
  const [name, setName] = useState("");
  const [sipUrl, setSipUrl] = useState("");

  useEffect(() => {
    fetch("/api/voice-trunk?userId=1")
      .then((res) => res.json())
      .then((data) => setTrunks(data));
  }, []);

  const createTrunk = async () => {
    const res = await fetch("/api/voice-trunk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, trunkId, name, sipUrl }),
    });
    if (res.ok) {
      alert("Voice trunk created!");
      setTrunkId("");
      setName("");
      setSipUrl("");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Voice Trunks (Bird.com)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Voice Trunk
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={trunkId}
                onChange={(e) => setTrunkId(e.target.value)}
                placeholder="Trunk ID"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Trunk name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <input
                type="url"
                value={sipUrl}
                onChange={(e) => setSipUrl(e.target.value)}
                placeholder="SIP URL (e.g., sip:trunk@bird.com)"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <button
                onClick={createTrunk}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Create Trunk
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Active Trunks
            </h2>
            <div className="space-y-3">
              {trunks.length === 0 ? (
                <p className="text-gray-400">No voice trunks created yet.</p>
              ) : (
                trunks.map((trunk) => (
                  <div
                    key={trunk.id}
                    className="border border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="text-white font-medium">{trunk.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      ID: {trunk.trunkId}
                    </p>
                    <p className="text-blue-400 text-xs">{trunk.sipUrl}</p>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          trunk.status === "active"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {trunk.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
