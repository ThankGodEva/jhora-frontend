'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// Define the expected shape of the user object
interface User {
  id?: number;
  name: string;
  email: string;
  // Add more fields later if your /user endpoint returns them (e.g. role, avatar_url)
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Attach token to all future requests from this axios instance
    api.defaults.headers.Authorization = `Bearer ${token}`;

    api
      .get('/user')
      .then((res) => {
        setUser(res.data); // TypeScript now knows res.data matches User
      })
      .catch((err) => {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        await api.post('/logout');
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
      router.push('/login');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your dashboard...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Not logged in. Redirecting...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-lg mb-4">
          <strong>Email:</strong> {user.email}
        </p>
        {/* Add more user info here later, e.g. role, shop name if vendor */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            delete api.defaults.headers.Authorization;
            router.push('/login');
          }}
          className="mt-4 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}