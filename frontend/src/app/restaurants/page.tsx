'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Restaurant } from '@/lib/types';
import { restaurantApi } from '@/lib/api';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantApi.list();
        setRestaurants(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-slate-900 animate-pulse" />
        ))}
      </div>
    );

  if (error)
    return <p className="text-red-400 text-sm">Error: {error}</p>;

  if (restaurants.length === 0)
    return <p>No restaurants available yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Restaurants</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 hover:border-orange-500 transition"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-sm">
              {r.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.logoUrl}
                  alt={r.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                r.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-sm">{r.name}</h2>
              <p className="text-xs text-slate-400 line-clamp-2">
                {r.description || r.address}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                <span>
                  {r.isOpen ? (
                    <span className="text-emerald-400">Open</span>
                  ) : (
                    <span className="text-red-400">Closed</span>
                  )}
                </span>
                {r.avgRating && r.avgRating > 0 && (
                  <span>⭐ {r.avgRating.toFixed(1)}</span>
                )}
                <span>Min ₦{(r.minOrderTotal / 100).toFixed(0)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
