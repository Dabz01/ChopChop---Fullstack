'use client';

import { useEffect, useState } from 'react';
import { restaurantApi } from '@/lib/api';
import { Restaurant, Order } from '@/lib/types';

export default function RestaurantOverviewPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!restaurant)
    return (
      <p className="text-sm text-slate-300">
        No restaurant linked to this account yet.
      </p>
    );

  const totalOrders = orders.length;
  const today = new Date().toDateString();
  const todaysOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  );

  const revenueKobo = orders.reduce((sum, o) => sum + o.total, 0);
  const revenueNaira = (revenueKobo / 100).toFixed(2);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{restaurant.name} overview</h1>
      <p className="text-xs text-slate-400">{restaurant.address}</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total orders</p>
          <p className="text-2xl font-semibold mt-1">{totalOrders}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Today&apos;s orders</p>
          <p className="text-2xl font-semibold mt-1">
            {todaysOrders.length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total revenue</p>
          <p className="text-2xl font-semibold mt-1">₦{revenueNaira}</p>
        </div>
      </div>
    </div>
  );
}
