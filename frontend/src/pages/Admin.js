import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get("http://127.0.0.1:8000/admin/stats");
    setStats(res.data);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-10 text-white min-h-screen bg-black">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">👨‍💼 Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-green-600 p-6 rounded-xl">
          <h2>Active Users</h2>
          <p className="text-3xl">{stats.active}</p>
        </div>

        <div className="bg-yellow-500 p-6 rounded-xl">
          <h2>Pending Users</h2>
          <p className="text-3xl">{stats.inactive}</p>
        </div>

        <div className="bg-blue-500 p-6 rounded-xl">
          <h2>Archived</h2>
          <p className="text-3xl">{stats.archived}</p>
        </div>

        <div className="bg-red-600 p-6 rounded-xl">
          <h2>Deleted</h2>
          <p className="text-3xl">{stats.deleted}</p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex gap-6">
        <button
          onClick={() => window.location.href = "/manage-users"}
          className="bg-purple-500 px-6 py-3 rounded-xl"
        >
          Manage Users
        </button>

        <button
          onClick={() => window.location.href = "/manage-feedback"}
          className="bg-pink-500 px-6 py-3 rounded-xl"
        >
          Manage Feedback
        </button>
      </div>

    </div>
  );
}