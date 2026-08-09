import { useState } from "react";
import axios from "axios";

export default function BookCard({ book }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const userId = localStorage.getItem("user_id");

  const addWishlist = async () => {
    await axios.post(
      `http://127.0.0.1:8000/wishlist/?user_id=${userId}&isbn=${book.isbn}`
    );

    alert("Added to Wishlist ❤️");
  };

  const submitRating = async (value) => {
    setRating(value);

    await axios.post(
      `http://127.0.0.1:8000/ratings/?user_id=${userId}&isbn=${book.isbn}&rating=${value}`
    );

    alert("Rated " + value + "⭐");
  };

  const feedback = async () => {
    const msg = prompt("Write feedback");

    if (!msg) return;

    await axios.post(
      "http://127.0.0.1:8000/feedback/",
      {
        user_id: userId,
        isbn: book.isbn,
        message: msg
      }
    );

    alert("Feedback Added 💬");
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white/10 rounded-xl p-4 cursor-pointer hover:scale-105 transition"
      >
        <img
          src={book.image_url}
          alt={book.title}
          className="h-64 w-full object-cover rounded mb-3"
        />

        <h2 className="font-bold">{book.title}</h2>
        <p>{book.author}</p>

        <div className="flex gap-2 mt-3">

          <button
            onClick={(e) => {
              e.stopPropagation();
              addWishlist();
            }}
            className="bg-pink-500 px-3 py-1 rounded"
          >
            ❤️
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              feedback();
            }}
            className="bg-green-500 px-3 py-1 rounded"
          >
            💬
          </button>

        </div>

        {/* Stars */}
        <div
          className="flex gap-1 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => submitRating(star)}
              className={`text-2xl ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              ★
            </button>
          ))}
        </div>

      </div>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

          <div className="bg-gray-900 p-8 rounded-xl max-w-xl">

            <img
              src={book.image_url}
              className="h-80 mx-auto rounded mb-5"
            />

            <h2 className="text-3xl font-bold mb-3">
              {book.title}
            </h2>

            <p className="text-gray-300 mb-3">
              {book.author}
            </p>

            <p>{book.summary}</p>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 bg-red-500 px-5 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}