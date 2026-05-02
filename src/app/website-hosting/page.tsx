import Link from 'next/link';
import { WebsiteHosting } from '@/components/hosting/WebsiteHosting';

export default function WebsiteHostingPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>
          <WebsiteHosting />
        </div>
      </div>
    </div>
  );
}