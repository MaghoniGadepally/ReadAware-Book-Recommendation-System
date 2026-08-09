import { Link } from "react-router-dom";

export default function PublicHeader() {
  return (
    <div className="w-full px-8 py-4 border-b border-white/10 bg-black text-white">
      <Link
        to="/"
        className="flex items-center gap-3 text-4xl font-bold text-pink-500"
      >
        📚 <span>ReadAware</span>
      </Link>
    </div>
  );
}