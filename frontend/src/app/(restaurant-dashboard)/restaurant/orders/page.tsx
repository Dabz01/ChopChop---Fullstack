'use client';

import { useEffect, useState } from 'react';
import { restaurantApi } from '@/lib/api';
import type { Order, Restaurant } from '@/lib/types';
import api from '@/lib/api';

export default function RestaurantOrdersPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const my = await restaurantApi.myRestaurants();
      if (!my.length) {
        setLoading(false);
        return;
      }
      const r = my[0];
      setRestaurant(r);
      const o = await restaurantApi.myRestaurantOrders(r.id);
      setOrders(o);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Order['status']) => {
    await api.patch(`/orders/${id}/status`, { status });
    await load();
  };

  if (loading) return <p>Loading orders...</p>;
  if (!restaurant) return <p>This account has no restaurant yet.</p>;

  if (!orders.length)
    return <p className="text-sm text-slate-300">No orders yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => {
          const created = new Date(o.createdAt).toLocaleString();
          const totalNaira = (o.total / 100).toFixed(2);

          return (
            <div
              key={o.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-slate-400">{created}</p>
                <p className="text-sm font-semibold mt-1">
                  #{o.id.slice(0, 8)}
                </p>
                <p className="text-xs text-slate-400">
                  Deliver to: {o.deliveryAddress}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Status: {o.status}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm font-semibold">₦{totalNaira}</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => updateStatus(o.id, 'ACCEPTED')}
                    className="text-[11px] border border-emerald-500 text-emerald-300 px-2 py-1 rounded-full"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, 'CANCELLED')}
                    className="text-[11px] border border-red-500 text-red-300 px-2 py-1 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
