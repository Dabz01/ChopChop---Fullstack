'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';

const statusLabel: Record<Order['status'], string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready',
  ASSIGNED_TO_RIDER: 'Assigned to rider',
  PICKED_UP: 'Picked up',
  ON_THE_WAY: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const statusColor: Record<Order['status'], string> = {
  PENDING: 'bg-slate-800 text-slate-100',
  ACCEPTED: 'bg-blue-900 text-blue-100',
  PREPARING: 'bg-blue-900 text-blue-100',
  READY_FOR_PICKUP: 'bg-amber-900 text-amber-100',
  ASSIGNED_TO_RIDER: 'bg-amber-900 text-amber-100',
  PICKED_UP: 'bg-amber-900 text-amber-100',
  ON_THE_WAY: 'bg-purple-900 text-purple-100',
  DELIVERED: 'bg-emerald-900 text-emerald-100',
  CANCELLED: 'bg-red-900 text-red-100',
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ordersApi.myOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error)
    return <p className="text-red-400 text-sm">Error: {error}</p>;

  if (orders.length === 0)
    return (
      <p className="mt-6 text-sm text-slate-300">
        You haven&apos;t placed any orders yet.
      </p>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My orders</h1>
      <div className="space-y-3">
        {orders.map((o) => {
          const created = new Date(o.createdAt);
          const totalNaira = (o.total / 100).toFixed(2);
          const badgeClass =
            'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ' +
            statusColor[o.status];

          return (
            <div
              key={o.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-slate-400">{created.toLocaleString()}</p>
                <p className="text-sm font-semibold mt-1">
                  Order #{o.id.slice(0, 8)}
                </p>
                <p className="text-xs text-slate-400">
                  Deliver to: {o.deliveryAddress}
                </p>
              </div>
              <div className="text-right">
                <span className={badgeClass}>{statusLabel[o.status]}</span>
                <p className="mt-2 text-sm font-semibold">₦{totalNaira}</p>
                <p className="text-[11px] text-slate-400">
                  Payment: {o.paymentStatus}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
