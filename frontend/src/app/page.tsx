import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold">
        Hungry? <span className="text-orange-400">ChopChop</span> don land. 🍽️
      </h1>
      <p className="text-slate-300 max-w-md">
        Discover nearby restaurants, order your favourite meals, and get them
        delivered fast—no stress.
      </p>
      <div className="flex gap-3 mt-4">
        <Link
          href="/restaurants"
          className="bg-orange-500 text-slate-950 px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-400"
        >
          Find food now
        </Link>
        <Link
          href="/login"
          className="border border-slate-700 px-5 py-2 rounded-full text-sm hover:bg-slate-900"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
