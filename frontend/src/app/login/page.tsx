'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(phoneOrEmail, password);
      router.push('/restaurants');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-slate-400 mb-4">
        Login to continue ordering your favourites.
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs text-slate-400">Phone or Email</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-800 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-orange-500 text-slate-950 py-2 rounded-lg text-sm font-semibold hover:bg-orange-400 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
