'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const res = await api.post('/login', { email, password });
        const { token } = res.data;

        localStorage.setItem('token', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;

        router.push('/');
      } catch (err: any) {
        const response = err.response?.data;

        if (response?.message && response?.errors) {
          // Show full validation errors
          const errorDetails = Object.values(response.errors)
            .flat()
            .join('\n');
          setError(`${response.message}\n\nDetails:\n${errorDetails}`);
        } else {
          setError(response?.message || 'Login failed. Please try again.');
        }
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