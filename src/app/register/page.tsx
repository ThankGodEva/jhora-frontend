'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1 - Email check
  const handleFirstStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    if (!email.trim()) {
      setFieldErrors({ email: 'Email is required' });
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: 'Please enter a valid email' });
      setLoading(false);
      return;
    }

    try {
      await api.post('/register/check-email', { email });
      setStep(2);
    } catch (err: any) {
      const response = err.response;
      if (response?.status === 422) {
        const msg = response.data.message || 'This email is already registered or invalid.';
        toast.error(msg);
        setError(msg);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2 - Full registration
  const handleFullRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    // Client-side password match check
    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    // Basic required fields check
    const requiredFields = ['first_name', 'last_name', 'phone', 'password'];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach(field => {
      if (!form[field as keyof typeof form]?.toString().trim()) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const dob = form.dob_year && form.dob_month && form.dob_day
        ? `${form.dob_year}-${form.dob_month.padStart(2, '0')}-${form.dob_day.padStart(2, '0')}`
        : undefined;

      const res = await api.post('/register', {
        name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        dob,
      });

      localStorage.setItem('token', res.data.token);
      api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

      toast.success('Registration successful! Welcome to JHORA 🎉', {
        duration: 5000,
      });

      router.push('/');
    } catch (err: any) {
      const response = err.response;

      if (response?.status === 422) {
        const serverErrors = response.data.errors || {};
        const msg = response.data.message || 'Please check your details.';

        // Show field-specific errors
        setFieldErrors(
          Object.fromEntries(
            Object.entries(serverErrors).map(([key, val]) => [key, (val as string[])[0]])
          )
        );

        toast.error(msg);
        setError(msg);
      } else {
        toast.error('Registration failed. Please try again later.');
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
              className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Email address"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>

          {/* ... Or continue with Google/Apple ... */}
        </form>
      ) : (
        <form onSubmit={handleFullRegister} className="mt-8 space-y-6">
          {/* Email (pre-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="mt-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
              {email}
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name *</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 ${
                  fieldErrors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last name *</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 ${
                  fieldErrors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.last_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone number *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 ${
                fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+234 ..."
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Minimum 8 characters"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:border-orange-500 focus:ring-orange-500 ${
                fieldErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password_confirmation}</p>
            )}
          </div>

          {/* DOB - optional */}
          {/* ... add your DOB fields here with similar error handling ... */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}