import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    user_id: "",
    phone: "",
    security_question: "",
    password: "",
  });

  const signup = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/signup", form);

      alert("Signup successful! Wait for admin approval");
      window.location.href = "/login";

    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-96">

        <h2 className="text-2xl mb-6 text-center">Signup</h2>

        <input
          placeholder="Name"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="User ID"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Security Question (e.g. your pet name?)"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setForm({ ...form, security_question: e.target.value })}
        />
        
        <input
        placeholder="Security Answer"
        className="w-full p-2 mb-3 text-black rounded"
        onChange={(e) => setForm({ ...form, security_answer: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 text-black rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={signup}
          className="w-full bg-green-500 p-2 rounded hover:scale-105 transition"
        >
          Signup
        </button>

      </div>
    </div>
  );
}