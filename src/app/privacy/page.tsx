import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-6">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              This Privacy Policy describes how our SaaS platform (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your information when you use our services including URL shortening, bulk SMS, website hosting, and Telegram bot hosting.
            </p>
            <p className="mb-4">
              By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect and process the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and payment information when you create an account or make a purchase.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our services, including IP address, browser type, operating system, and pages visited.
              </li>
              <li>
                <strong>Service-Specific Data:</strong> 
                <ul className="list-none pl-0 mt-1">
                  <li>• URLs you shorten and associated analytics</li>
                  <li>• SMS campaign details and recipient information</li>
                  <li>• Website files and hosting configurations</li>
                  <li>• Telegram bot configurations and message data</li>
                </ul>
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track activity on our service and store certain information.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send you invoices</li>
              <li>To send you important service announcements and updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage trends and improve our platform</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              4. Sharing Your Information
            </h2>
            <p className="mb-4">
              We do not sell your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Service Providers:</strong> With trusted third parties who help us operate our platform (e.g., payment processors, email services, hosting providers).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, regulation, or legal process (such as a subpoena or court order).
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
              </li>
              <li>
                <strong>With Your Consent:</strong> For any other purpose with your explicit consent.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Your Rights
            </h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain types of processing</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Withdraw consent where we rely on it for processing</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us at privacy@yourservice.com.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              8. International Data Transfers
            </h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. These countries may not have data protection laws equivalent to those in your jurisdiction.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              10. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> privacy@yourservice.com<br/>
              <strong>Address:</strong> [Your Company Address]
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500">
          <p>Last updated: May 2, 2026</p>
        </div>
      </div>
    </div>
  );
}