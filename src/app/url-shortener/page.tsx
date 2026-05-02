import { UrlShortener } from '@/components/UrlShortener';

export default function UrlShortenerPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <a href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </a>
          </div>
          <UrlShortener />
        </div>
      </div>
    </div>
  );
}