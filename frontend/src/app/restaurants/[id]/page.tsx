'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RestaurantWithMenu, MenuItem } from '@/lib/types';
import { restaurantApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await restaurantApi.getWithMenu(id);
        setRestaurant(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleAdd = (item: MenuItem) => {
    if (!item.isAvailable || !restaurant) return;
    addItem(item, restaurant.id);
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p className="text-red-400 text-sm">Error: {error}</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm">
          {restaurant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            restaurant.name.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
          <p className="text-xs text-slate-400">{restaurant.address}</p>
          <div className="mt-1 text-[11px] text-slate-400 flex gap-3">
            <span>
              {restaurant.isOpen ? (
                <span className="text-emerald-400">Open</span>
              ) : (
                <span className="text-red-400">Closed</span>
              )}
            </span>
            {restaurant.avgRating && restaurant.avgRating > 0 && (
              <span>⭐ {restaurant.avgRating.toFixed(1)}</span>
            )}
            <span>Min ₦{(restaurant.minOrderTotal / 100).toFixed(0)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {restaurant.menuItems.length === 0 ? (
          <p>No items available yet.</p>
        ) : (
          restaurant.menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  ₦{(item.price / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-xl"
                  />
                )}
                <button
                  disabled={!item.isAvailable}
                  onClick={() => handleAdd(item)}
                  className="text-xs bg-orange-500 text-slate-950 px-3 py-1 rounded-full hover:bg-orange-400 disabled:opacity-40"
                >
                  {item.isAvailable ? 'Add' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
