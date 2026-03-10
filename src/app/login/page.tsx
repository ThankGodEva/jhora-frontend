'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // if you have local error state
    setLoading(true);

    try {
      const res = await api.post('/login', { email, password });

      // Success
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

      toast.success('Login successful! Welcome back.', {
        duration: 3000,
        position: 'top-center',
      });

      router.push('/'); // or dashboard

    } catch (err: any) {
      const response = err.response;

      let message = 'An unexpected error occurred. Please try again.';

      if (response?.status === 422) {
        message = response.data.message || 'Invalid email or password. Please check your credentials.';
      } else if (response?.status === 500) {
        message = 'Server error. Please try again later.';
      }

      // Show toast instead of (or in addition to) inline error
      toast.error(message, {
        duration: 5000,
        position: 'top-center',
      });

      // Optional: keep inline error if you prefer both
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">JHORA Login</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}