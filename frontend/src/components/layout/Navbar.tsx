'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { items, totalKobo } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalNaira = (totalKobo / 100).toFixed(2);

  return (
    <header className="border-b border-slate-800">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950">
            CC
          </span>
          <span className="font-semibold text-lg">ChopChop</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/restaurants"
            className="text-sm hover:text-orange-400 transition"
          >
            Restaurants
          </Link>

          <Link
            href="/orders"
            className="text-sm hover:text-orange-400 transition"
          >
            My orders
          </Link>

          <Link
            href="/cart"
            className="text-sm hover:text-orange-400 transition relative"
          >
            Cart
            {totalItems > 0 && (
              <span className="ml-1 text-xs text-slate-300">
                ({totalItems}) ₦{totalNaira}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-sm text-slate-300 hidden sm:inline">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="text-xs border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs bg-orange-500 text-slate-950 rounded-full px-3 py-1 hover:bg-orange-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
