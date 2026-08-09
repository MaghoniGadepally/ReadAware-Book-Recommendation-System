import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        user_id,
        password,
      });
  
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("user_id", res.data.id);
      localStorage.setItem("username", res.data.name);
  
      alert("✅ OTP sent to your email");
  
      window.location.href = "/otp";
  
    } catch (err) {
      alert("❌ Login failed");
      console.log(err);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-80">

        <h2 className="text-2xl mb-6 text-center">Login</h2>

        <input
          placeholder="User ID"
          className="w-full p-2 mb-4 text-black rounded"
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
          className="w-full bg-pink-500 p-2 rounded hover:scale-105 transition"
        >
          Login
        </button>

        <p
          className="text-sm mt-3 text-blue-400 cursor-pointer"
          onClick={() => window.location.href = "/forgot-password"}
        >
          Forgot Password?
        </p>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-pink-400 cursor-pointer"
            onClick={() => window.location.href = "/signup"}
          >
            Create one
          </span>
        </p>

      </div>
    </div>
  );
}