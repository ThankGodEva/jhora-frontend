'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Banknote, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
  reference: string;
}

interface PaymentStats {
  available: number;
  pending: number;
  totalEarned: number;
  monthlyPayout: number;
}

export default function VendorPayments() {
  const [stats, setStats] = useState<PaymentStats>({
    available: 0,
    pending: 0,
    totalEarned: 0,
    monthlyPayout: 0,
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/payments');
      setStats(res.data.stats);
      setPayouts(res.data.recentPayouts || []);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    if (!requestAmount || Number(requestAmount) > stats.available) {
      alert('Invalid amount');
      return;
    }

    try {
      await api.post('/vendor/payouts/request', { amount: Number(requestAmount) });
      setShowRequestModal(false);
      setRequestAmount('');
      fetchPaymentData();
      alert('Payout request submitted successfully');
    } catch (err) {
      alert('Failed to request payout');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments & Payouts</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available for Payout</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ₦{stats.available.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Request Payout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                ₦{stats.pending.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                ₦{stats.totalEarned.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Payouts</h2>
          <span className="text-sm text-gray-600">
            This Month: ₦{stats.monthlyPayout.toLocaleString()}
          </span>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading payouts...</div>
          ) : payouts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No payouts yet
            </div>
          ) : (
            payouts.map((payout) => (
              <div key={payout.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-medium">Payout #{payout.reference}</p>
                  <p className="text-sm text-gray-600 mt-1">{payout.date} • {payout.method}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`font-bold ${payout.status === 'completed' ? 'text-green-600' : payout.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                      ₦{payout.amount.toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payout.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payout.status === 'completed' && <CheckCircle size={14} />}
                    {payout.status === 'failed' && <XCircle size={14} />}
                    {payout.status === 'pending' && <Clock size={14} />}
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payout Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Payout</h2>
            <p className="text-gray-600 mb-6">
              Available balance: ₦{stats.available.toLocaleString()}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to payout (₦)
              </label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                max={stats.available}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={requestPayout}
                disabled={!requestAmount || Number(requestAmount) > stats.available}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg disabled:opacity-50"
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}