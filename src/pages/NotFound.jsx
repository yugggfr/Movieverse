import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-8xl mb-6">🎬</div>
      <h1 className="text-6xl font-black text-white mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-8">
        This scene doesn't exist in MovieVerse.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
