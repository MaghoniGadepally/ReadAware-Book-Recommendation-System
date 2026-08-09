import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Popularity() {
  const [books, setBooks] = useState([]);

  const fetchPopular = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/books/popular"
      );

      setBooks(res.data || []);
    } catch {
      alert("Failed to load popular books");
    }
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 to-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        🔥 Popular Books
      </h1>

      <div className="grid md:grid-cols-4 gap-8">

        {books.map((book, i) => (
          <div key={i} className="relative">

            <BookCard book={book} />

            <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-xl font-bold shadow-xl">
              ⭐ {book.rating || 0}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}