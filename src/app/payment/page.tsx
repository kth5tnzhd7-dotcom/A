import Link from "next/link";
import { useState } from "react";

export default function PaymentPage() {
  const [amount, setAmount] = useState("5");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-oxapay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), userId: 1 }),
      });

      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Payment created! ID: " + data.paymentId);
        window.location.reload();
      }
    } catch (e) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">← Back</Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">Deposit Funds</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Amount (USD)</label>
            <select 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="5">$5 - Minimum Deposit</option>
              <option value="10">$10</option>
              <option value="25">$25</option>
              <option value="50">$50</option>
              <option value="100">$100</option>
            </select>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-1">You are depositing:</p>
            <p className="text-2xl font-bold text-white">${amount}</p>
          </div>

          <button 
            onClick={handleDeposit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Processing..." : `Deposit $${amount} via Oxapay`}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Minimum deposit: $5. Secure payment via Oxapay.
          </p>
        </div>
      </div>
    </div>
  );
}
