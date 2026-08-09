import { useEffect, useState } from "react";
import axios from "axios";

export default function MyLibrary() {
  const [wishlist, setWishlist] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const wish = await axios.get(
        `http://127.0.0.1:8000/wishlist/${userId}`
      );

      const history = await axios.get(
        `http://127.0.0.1:8000/library/history/${userId}`
      );

      setWishlist(wish.data || []);
      setRatings(history.data.ratings || []);
      setFeedbacks(history.data.feedbacks || []);
    } catch (err) {
      console.log(err);
    }
  };

  const removeWish = async (isbn) => {
    await axios.delete("http://127.0.0.1:8000/wishlist/", {
      params: {
        user_id: userId,
        isbn: isbn
      }
    });

    fetchData();
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        📚 My Library
      </h1>

      {/* Wishlist */}
      <div className="mb-12">
        <h2 className="text-3xl text-pink-400 mb-5">
          ❤️ Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <p>No books in wishlist</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {wishlist.map((item, i) => (
              <div key={i} className="bg-white/10 p-5 rounded-xl">
                <p>{item.title || item.isbn}</p>

                <button
                  onClick={() => removeWish(item.isbn)}
                  className="mt-3 bg-red-500 px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="mb-12">
        <h2 className="text-3xl text-yellow-400 mb-5">
          ⭐ My Ratings
        </h2>

        {ratings.length === 0 ? (
          <p>No ratings submitted</p>
        ) : (
          ratings.map((r, i) => (
            <div key={i} className="bg-white/10 p-4 mb-3 rounded">
              {r.title} — {r.rating} ⭐
            </div>
          ))
        )}
      </div>

      {/* Feedback */}
      <div>
        <h2 className="text-3xl text-green-400 mb-5">
          💬 My Feedback
        </h2>

        {feedbacks.length === 0 ? (
          <p>No feedback submitted</p>
        ) : (
          feedbacks.map((f, i) => (
            <div key={i} className="bg-white/10 p-4 mb-3 rounded">
              <b>{f.title}</b>
              <br />
              {f.message}
            </div>
          ))
        )}
      </div>

    </div>
  );
}