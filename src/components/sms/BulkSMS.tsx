"use client";

import { useState } from 'react';
import { Send, Upload, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export interface Recipient {
  phone: string;
  country: string;
}

export interface BulkSMSProps {
  onSend?: (campaign: any) => void;
}

export function BulkSMS({ onSend }: BulkSMSProps) {
  const [senderId, setSenderId] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const parsedRecipients = lines.map(line => {
        const [phone, country] = line.split(',').map(s => s.trim());
        return { phone: phone || '', country: country || '' };
      });
      setRecipients(parsedRecipients);
      setStep(2);
    } catch (error) {
      console.error('Failed to parse file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const campaign = {
        senderId,
        message,
        recipients,
        scheduledAt: scheduledDate ? new Date(scheduledDate) : undefined,
      };
      onSend?.(campaign);
    } catch (error) {
      console.error('Failed to send campaign:', error);
    } finally {
      setIsSending(false);
    }
  };

  const addRecipient = () => {
    setRecipients([...recipients, { phone: '', country: '' }]);
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const characterCount = message.length;
  const estimatedCost = (recipients.length * 0.0075).toFixed(2);

  if (step === 1) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Bulk SMS Campaign</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Recipients (CSV)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-300">Click to upload or drag and drop</span>
                  <span className="text-sm text-gray-500">CSV or TXT files with phone numbers</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-200 mb-2">CSV Format</h3>
          <pre className="text-sm text-gray-400 bg-gray-800 rounded p-3 overflow-x-auto">
{`+1234567890,United States
+441234567890,United Kingdom
+491234567890,Germany`}
          </pre>
        </div>

        <button
          onClick={() => setStep(2)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Compose Message</h2>
          </div>
          <button
            onClick={() => setStep(1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sender ID
            </label>
            <input
              type="text"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Enter your message..."
              maxLength={1600}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${characterCount > 1600 ? 'text-red-400' : 'text-gray-400'}`}>
                {characterCount}/1600 characters
              </span>
              <span className="text-sm text-gray-400">
                {Math.ceil(characterCount / 160)} segments
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Schedule (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <span className="text-gray-300">Recipients</span>
            <span className="font-semibold text-white">{recipients.length}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-gray-300">Estimated Cost</span>
            <span className="font-semibold text-blue-400">${estimatedCost}</span>
          </div>

          {recipients.length > 0 && (
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <span className="font-medium text-gray-200">Recipient List</span>
                <button
                  onClick={addRecipient}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Manually
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 border-b border-gray-700 last:border-b-0"
                  >
                    <Phone className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={recipient.phone}
                      onChange={(e) => updateRecipient(index, 'phone', e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="Phone number"
                    />
                    <input
                      type="text"
                      value={recipient.country}
                      onChange={(e) => updateRecipient(index, 'country', e.target.value)}
                      className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="Country"
                    />
                    <button
                      onClick={() => removeRecipient(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!senderId || !message || recipients.length === 0 || isSending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Campaign
              </>
            )}
          </button>
        </div>
      </div>
    );
  }
}
