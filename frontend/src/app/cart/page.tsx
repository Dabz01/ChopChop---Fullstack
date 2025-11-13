'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ordersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, addItem, clear, totalKobo, restaurantId } = useCart();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalNaira = (totalKobo / 100).toFixed(2);

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!restaurantId) {
      setError('Missing restaurant info for order.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        restaurantId,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
        deliveryAddress,
        paymentMethod: 'CASH_ON_DELIVERY' as const,
      };

      await ordersApi.create(payload);
      setSuccess('Order placed successfully!');
      clear();
      setDeliveryAddress('');
      router.push('/orders');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to place order. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <p className="mt-6 text-sm text-slate-300">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-semibold">Your cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-sm font-semibold">{item.menuItem.name}</h2>
              <p className="text-xs text-slate-400">
                ₦{(item.menuItem.price / 100).toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeItem(item.menuItem.id)}
                className="h-7 w-7 rounded-full border border-slate-700 flex items-center justify-center text-xs"
              >
                -
              </button>
              <span className="text-sm">{item.quantity}</span>
              <button
                onClick={() => addItem(item.menuItem, restaurantId as string)}
                className="h-7 w-7 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center text-xs"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400">Delivery address</label>
          <textarea
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-800 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800 px-3 py-2 rounded-lg">
            {success}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total</p>
            <p className="text-xl font-semibold">₦{totalNaira}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clear}
              className="text-xs border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-900"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-xs bg-orange-500 text-slate-950 rounded-full px-4 py-2 hover:bg-orange-400 disabled:opacity-50"
            >
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
