import { BulkSMS } from '@/components/sms/BulkSMS';

export default function BulkSMSPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <a href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </a>
          </div>
          <BulkSMS />
        </div>
      </div>
    </div>
  );
}