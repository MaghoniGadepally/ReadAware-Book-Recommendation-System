import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageFeedback() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/feedback/all"
    );

    setData(res.data || []);
  };

  const remove = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/admin/feedback/${id}`
    );

    fetchFeedback();
  };

  const filtered = data.filter((f) =>
    f.message.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

      {/* Top */}
      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate("/admin")}
          className="bg-pink-500 px-5 py-2 rounded-xl"
        >
          ← Dashboard
        </button>

        <input
          placeholder="Search feedback..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="p-3 rounded-xl text-black w-72"
        />

      </div>

      <h1 className="text-5xl font-bold mb-8">
        💬 Manage Feedback
      </h1>

      <div className="space-y-4">

        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-white/10 backdrop-blur-md p-5 rounded-2xl flex justify-between items-center shadow-xl"
          >

            <div>
              <p className="text-lg">
                {f.message}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                User ID: {f.user_id}
              </p>
            </div>

            <button
              onClick={() => remove(f.id)}
              className="bg-red-500 px-5 py-2 rounded-xl"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}