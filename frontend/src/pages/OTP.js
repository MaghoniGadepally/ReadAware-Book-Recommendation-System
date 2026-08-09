import { useState } from "react";
import axios from "axios";

export default function OTP() {
  const [otp, setOtp] = useState("");

  const email = localStorage.getItem("email");

  const verify = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", res.data.name);
      localStorage.setItem("user_id", res.data.user_id);

      alert("Login successful");
      window.location.href = "/home";

    } catch (err) {
      console.log(err);
      alert("Invalid OTP or expired");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="bg-white/10 p-8 rounded-xl">
        <h2 className="text-xl mb-4">Enter OTP</h2>

        <input
          placeholder="Enter OTP"
          className="p-2 text-black rounded mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verify}
          className="bg-green-500 p-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}