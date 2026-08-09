import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/admin/users"
    );

    setUsers(res.data || []);
  };

  const approve = async (id) => {
    await axios.put(
      `http://127.0.0.1:8000/admin/approve/${id}`
    );
    fetchUsers();
  };

  const archive = async (id) => {
    await axios.put(
      `http://127.0.0.1:8000/admin/archive/${id}`
    );
    fetchUsers();
  };

  const remove = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/admin/delete/${id}`
    );
    fetchUsers();
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

      {/* Top */}
      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate("/admin")}
          className="bg-pink-500 px-5 py-2 rounded-xl hover:scale-105"
        >
          ← Dashboard
        </button>

        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="p-3 rounded-xl text-black w-72"
        />

      </div>

      <h1 className="text-5xl font-bold mb-8">
        👥 Manage Users
      </h1>

      <div className="space-y-4">

        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-white/10 backdrop-blur-md p-5 rounded-2xl flex justify-between items-center shadow-xl"
          >

            <div>
              <h2 className="text-xl font-bold">
                {u.name}
              </h2>

              <p className="text-gray-300">
                {u.email}
              </p>

              <p className="text-pink-400 mt-1">
                Status: {u.status}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => approve(u.id)}
                className="bg-green-500 px-4 py-2 rounded-xl"
              >
                Approve
              </button>

              <button
                onClick={() => archive(u.id)}
                className="bg-yellow-500 px-4 py-2 rounded-xl"
              >
                Archive
              </button>

              <button
                onClick={() => remove(u.id)}
                className="bg-red-500 px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}