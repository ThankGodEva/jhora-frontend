'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';

export default function ShippingSetup() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    state: '',
    delivery_time: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/vendor/setup/shipping', form);
      router.push('/become-icreator/success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save shipping info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Account setup">
      <div className="mt-4 flex justify-between text-sm font-medium">
        <span className="text-gray-400">Personal Information</span>
        <span className="text-orange-600">Shipping</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Customer representative *
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Choose a contact for communication to direct any complaints from customers.
          </p>
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full name *
          </label>
          <input
            id="full_name"
            type="text"
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone number *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
            Shop 1 *
          </label>
          <input
            id="address_line1"
            type="text"
            required
            value={form.address_line1}
            onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
            placeholder="Shop address line 1"
          />
        </div>

        <div>
          <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">
            Shop 2
          </label>
          <input
            id="address_line2"
            type="text"
            value={form.address_line2}
            onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
            placeholder="Shop address line 2 (optional)"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <input
            id="state"
            type="text"
            required
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="delivery_time" className="block text-sm font-medium text-gray-700">
            Delivery Time *
          </label>
          <select
            id="delivery_time"
            required
            value={form.delivery_time}
            onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select time</option>
            <option value="1-2 days">1-2 days</option>
            <option value="3-5 days">3-5 days</option>
            <option value="5-7 days">5-7 days</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & continue'}
        </button>
      </form>
    </AuthLayout>
  );
}