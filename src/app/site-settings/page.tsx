import Link from "next/link";
import { useState } from "react";

export default function SiteSettingsPage() {
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [background, setBackground] = useState("");
  const [siteName, setSiteName] = useState("Exoincs");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState("#10B981");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logo,
        favicon,
        background,
        siteName,
        primaryColor,
        secondaryColor,
        userId: 1,
      }),
    });
    if (res.ok) alert("Settings saved!");
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Site Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            {logo && (
              <img src={logo} alt="Logo preview" className="mt-2 h-16" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Favicon URL
            </label>
            <input
              type="url"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              placeholder="https://example.com/favicon.ico"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="https://example.com/bg.jpg"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            {background && (
              <div className="mt-2 h-32 bg-cover bg-center rounded" style={{ backgroundImage: `url(${background})` }} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
