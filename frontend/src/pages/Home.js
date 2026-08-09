import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-10">

      <h1 className="text-5xl font-extrabold text-center mb-4">
        📚 ReadAware
      </h1>

      <p className="text-center text-gray-300 mb-12 text-lg">
        Smart Book Recommendation System
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Content */}
        <Link to="/content" className="card">
          <h2>🔍 Content Based</h2>
          <p>Search and get similar books</p>
        </Link>

        {/* Mood */}
        <Link to="/mood" className="card">
          <h2>😊 Mood Based</h2>
          <p>Books based on your mood</p>
        </Link>

        {/* Popular */}
        <Link to="/popular" className="card">
          <h2>🔥 Popular Books</h2>
          <p>Top trending books</p>
        </Link>

        {/* Hybrid */}
        <Link to="/hybrid" className="card">
          <h2>🤖 Hybrid System</h2>
          <p>Best recommendations</p>
        </Link>

        {/* Collaborative */}
        <Link to="/collaborative" className="card">
          <h2>🤝 Collaborative</h2>
          <p>Users with similar taste</p>
        </Link>

      </div>
    </div>
  );
}