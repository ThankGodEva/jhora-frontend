'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';
import { Link } from 'lucide-react';

export default function FullInfo() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FullInfoContent />
    </Suspense>
  );
}

function FullInfoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    business_name: '',
    store_name: '',
    business_type: '',
    business_category: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/become-icreator');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/register/icreator', {
        email,
        name: `${form.first_name} ${form.last_name}`,
        phone: form.phone,
        business_name: form.business_name,
        store_name: form.store_name,
        business_type: form.business_type,
        business_category: form.business_category,
        dob: `${form.dob_year}-${form.dob_month}-${form.dob_day}`,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      localStorage.setItem('token', res.data.token);
      api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

      router.push('/become-icreator/verify');
    } catch (err: any) {
      const response = err.response?.data;
      if (response?.errors) {
        const details = Object.entries(response.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        setError(`Validation failed:\n${details}`);
      } else {
        setError(response?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Email (pre-filled & visible) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-gray-100"
            disabled // optional - can make editable
          />
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First name *
            </label>
            <input
              id="first_name"
              type="text"
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last name *
            </label>
            <input
              id="last_name"
              type="text"
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
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
            placeholder="+234 ..."
          />
        </div>

        {/* Business Info */}
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Business name *
          </label>
          <input
            id="business_name"
            type="text"
            required
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
            Store name *
          </label>
          <input
            id="store_name"
            type="text"
            required
            value={form.store_name}
            onChange={(e) => setForm({ ...form, store_name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
            Business Type *
          </label>
          <select
            id="business_type"
            required
            value={form.business_type}
            onChange={(e) => setForm({ ...form, business_type: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select type</option>
            <option value="sole_proprietor">Sole Proprietor</option>
            <option value="limited_company">Limited Company</option>
            <option value="partnership">Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* DOB */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <select
              value={form.dob_day}
              onChange={(e) => setForm({ ...form, dob_day: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              value={form.dob_month}
              onChange={(e) => setForm({ ...form, dob_month: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              value={form.dob_year}
              onChange={(e) => setForm({ ...form, dob_year: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Year</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <input
            id="password_confirmation"
            type="password"
            required
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-start">
          <input type="checkbox" className="mt-1 mr-2 accent-orange-600" />
          <label className="text-sm text-gray-600">
            I agree to JHORA's <Link href="#" className="text-orange-600 hover:underline">Privacy Policy</Link> and{' '}
            <Link href="#" className="text-orange-600 hover:underline">Terms of Use</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}