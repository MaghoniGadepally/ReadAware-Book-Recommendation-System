import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/admin-login", {
        user_id,
        password,
      });

      alert("Admin login successful");
      localStorage.setItem("role", "admin");
      window.location.href = "/admin";

    } catch (err) {
      alert("Admin login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">

      <div className="bg-white/10 p-8 rounded-xl w-80">

        <h2 className="text-2xl mb-6 text-center">Admin Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-red-500 p-2 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}