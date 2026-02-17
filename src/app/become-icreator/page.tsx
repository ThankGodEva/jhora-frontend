'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { Link } from 'lucide-react';
import api from '@/lib/api';

export default function BecomeICreator() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await api.post('/register/check-email', { email });
      router.push(`/become-icreator/full-info?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'This email is already registered or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Become an iCreator">
      <form onSubmit={handleContinue} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            placeholder="Email address"
          />
          <p className="mt-2 text-xs text-gray-500">
            We'll send you a code to verify your email
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Continue'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-4 text-gray-500">Or</span>
          </div>
        </div>

        <div className="space-y-4">
          <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-full hover:bg-gray-50">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-full hover:bg-gray-50">
            <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5" />
            Continue with Apple
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already an iCreator?{' '}
          <Link href="/login" className="text-orange-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}