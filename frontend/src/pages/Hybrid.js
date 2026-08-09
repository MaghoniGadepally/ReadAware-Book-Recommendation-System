import { useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Hybrid() {
  const [book, setBook] = useState("");
  const [mood, setMood] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHybrid = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/books/hybrid",
        {
          params: {
            book,
            mood
          }
        }
      );

      setResults(res.data.recommendations || []);
    } catch {
      alert("Hybrid failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        ⚡ Smart Hybrid Recommendations
      </h1>

      <div className="flex flex-wrap gap-4 mb-10">

        <input
          value={book}
          onChange={(e) => setBook(e.target.value)}
          placeholder="Enter book..."
          className="p-3 rounded-xl text-black w-72"
        />

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="p-3 rounded-xl text-black"
        >
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="calm">Calm</option>
          <option value="tired">Tired</option>
        </select>

        <button
          onClick={getHybrid}
          className="bg-purple-500 px-8 py-3 rounded-xl hover:scale-105"
        >
          Recommend
        </button>

      </div>

      {loading ? (
        <h2 className="text-2xl animate-pulse">
          Loading...
        </h2>
      ) : (
        <div className="grid md:grid-cols-4 gap-8">
          {results.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>
      )}

    </div>
  );
}