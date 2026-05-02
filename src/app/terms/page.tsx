import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-6">
          Terms of Service
        </h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using our SaaS platform ("Service"), you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any other terms and conditions that may apply to specific sections of the Service or to products and services available through the Service.
            </p>
            <p className="mb-4">
              If you do not agree to all of these Terms, you may not access or use the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Description of Services
            </h2>
            <p className="mb-4">
              Our platform provides the following services:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>URL Shortener Service - Create shortened URLs with custom domain support and click analytics</li>
              <li>Bulk SMS Service - Send SMS campaigns to multiple recipients with scheduling and delivery tracking</li>
              <li>Website Hosting Service - Host static websites with custom domains and file management</li>
              <li>Telegram Bot Hosting - Create and manage Telegram bots with command configuration and webhook support</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              3. User Accounts
            </h2>
            <p className="mb-4">
              To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>
            <p className="mb-4">
              We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              4. User Conduct
            </h2>
            <p className="mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Violate any applicable local, state, national, or international law, or any regulations having the force of law</li>
              <li>Infringe upon the rights of others, or in any way be harmful to others</li>
              <li>Transmit or facilitate the transmission of any virus, worm, defect, Trojan horse, or other harmful items</li>
              <li>Engage in any fraudulent, deceptive, or misleading activities</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Intellectual Property
            </h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our company.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Third-Party Links
            </h2>
            <p className="mb-4">
              The Service may contain links to third-party websites or services that are not owned or controlled by our company. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="mb-4">
              You further acknowledge and agree that our company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Limitation of Liability
            </h2>
            <p className="mb-4">
              In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Any unauthorized access to, use of, or alteration of your transmissions or content</li>
            </ul>
            <p className="mb-4">
              Our company assumes no liability or responsibility for any:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Errors, mistakes, or inaccuracies of content</li>
              <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to or use of the Service</li>
              <li>Any unauthorized access to, use of, or alteration of your transmissions or content</li>
              <li>Any loss of business profits, business interruption, or any loss of business opportunities</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              8. Indemnification
            </h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless our company and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, demands, expenses, including attorneys' fees, damages, losses, liabilities, (known or unknown), arising out of:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Your use of and access to the Service</li>
              <li>Your violation of any portion of these Terms</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Governing Law
            </h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
            </p>
            <p className="mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mb-4">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              11. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> legal@yourservice.com<br/>
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