'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirmation: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle first step (email check)
  const handleFirstStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/register/check-email', { email });

      if (res.status === 200) {
        setStep(2);
      }
    } catch (err: any) {
      console.error('Check email error:', err);

      const response = err.response?.data;

      if (response?.errors) {
        // Show detailed Laravel validation errors
        const details = Object.entries(response.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        setError(`Validation failed:\n${details}`);
      } else if (response?.message) {
        setError(response.message);
      } else {
        setError('Unable to check email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle full registration
  const handleFullRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Submitting full registration:', { email, ...form });

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/register', {
        name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        dob: form.dob_year && form.dob_month && form.dob_day
          ? `${form.dob_year}-${form.dob_month.padStart(2, '0')}-${form.dob_day.padStart(2, '0')}`
          : null,
      });

      console.log('Registration success:', res.data);

      localStorage.setItem('token', res.data.token);
      api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

      router.push('/');
    } catch (err: any) {
      console.error('Full registration error:', err);

      const response = err.response?.data;

      if (response?.errors) {
        const details = Object.entries(response.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        setError(`Registration failed:\n${details}`);
      } else {
        setError(response?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={step === 1 ? 'Sign up' : 'Create account'}>
      {step === 1 ? (
        <form onSubmit={handleFirstStep} className="mt-8 space-y-6">
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
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleFullRegister} className="mt-8 space-y-6">
          {/* Email field stays visible & pre-filled */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // still editable
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-gray-100"
              placeholder="Email address"
            />
            <p className="mt-1 text-xs text-gray-500">
              We'll send you a code to verify this email
            </p>
          </div>

          {/* Rest of the form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First name *
              </label>
              <input
                id="first_name"
                name="first_name"
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
                name="last_name"
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
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500"
              placeholder="+234 ..."
            />
          </div>

          {/* Date of Birth */}
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              name="password"
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
              name="password_confirmation"
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

          {/* Submit button with loading state */}
          <button
            type="submit"  // Make sure type="submit" is here
            disabled={loading}
            className={`w-full py-4 rounded-full font-medium transition ${
              loading
                ? 'bg-orange-400 cursor-wait text-white'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create account'
            )}
          </button>

          {/* Debug button - remove later */}
          <button
            type="button"
            onClick={() => console.log('Form data:', { email, ...form })}
            className="w-full border border-gray-300 py-3 rounded-full text-gray-700 hover:bg-gray-50"
          >
            Log Form Data (Debug)
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}