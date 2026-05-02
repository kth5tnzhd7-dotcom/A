"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AIProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [type, setType] = useState("crypto");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ai-project?userId=1")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const generateProject = async () => {
    setLoading(true);
    const res = await fetch("/api/ai-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, type, title, description }),
    });

    const data = await res.json();
    if (data.success) {
      alert("AI project generated!");
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">AI Project Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Generate New Project
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="crypto">Cryptocurrency</option>
                  <option value="nft">NFT Project</option>
                  <option value="web3">Web3 Platform</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Amazing Crypto Project"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project vision..."
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <button
                onClick={generateProject}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate AI Project"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Generated Projects
            </h2>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-gray-400">No projects generated yet.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        {project.type}
                      </span>
                      <h3 className="text-white font-medium">{project.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {project.description}
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        View Live
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                        Edit
                      </button>
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
