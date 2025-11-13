'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isOwner, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !isOwner) {
        router.push('/login');
      }
    }
  }, [user, isOwner, loading, router]);

  if (loading || !user || !isOwner) {
    return <p className="p-4 text-sm">Checking access...</p>;
  }

  return (
    <div className="flex gap-6 py-6">
      <aside className="w-48 border-r border-slate-800 pr-4 text-sm">
        <h2 className="font-semibold mb-3">Restaurant dashboard</h2>
        <nav className="space-y-2">
          <Link
            href="/restaurant/dashboard"
            className="block hover:text-orange-400"
          >
            Overview
          </Link>
          <Link
            href="/restaurant/orders"
            className="block hover:text-orange-400"
          >
            Orders
          </Link>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
}
