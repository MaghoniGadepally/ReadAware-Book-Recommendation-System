import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Collaborative() {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("");

  const userId = localStorage.getItem("user_id");

  const fetchBooks = async (selectedGenre = "") => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/collaborative/${userId}`,
        {
          params: {
            genre: selectedGenre
          }
        }
      );

      setBooks(res.data);

    } catch (err) {
      console.log(err);
      alert("Search failed");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        🤝 Collaborative Recommendations
      </h1>

      <div className="flex gap-4 mb-10">

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-3 text-black rounded w-72"
        >
          <option value="">All Genres</option>
          <option value="Self-help">Self-help</option>
          <option value="Fiction">Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Finance">Finance</option>
          <option value="Dystopian">Dystopian</option>
        </select>

        <button
          onClick={() => fetchBooks(genre)}
          className="bg-pink-500 px-6 py-3 rounded-xl"
        >
          Search
        </button>

      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {books.map((book, i) => (
          <BookCard key={i} book={book} />
        ))}
      </div>

    </div>
  );
}