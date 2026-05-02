import Link from "next/link";
import { useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Verification failed");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Exoincs</h1>
          <p className="mt-2 text-gray-400">
            Verify your email address
          </p>
        </div>

        {success ? (
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-400">
                Redirecting to signin...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleVerify}>
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={() => {
                    fetch("/api/auth/resend-code", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    alert("New code sent!");
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Resend code
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300">
            ← Back to signin
          </Link>
        </div>
      </div>
    </div>
  );
}
