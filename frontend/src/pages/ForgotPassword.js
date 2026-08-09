import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

  const [userId, setUserId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Get Question
  const getQuestion = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/auth/forgot/${userId}`
      );

      setQuestion(res.data.question);

    } catch (err) {
      alert("User not found");
    }
  };

  // Step 2: Reset Password
  const resetPassword = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/reset-password", {
        user_id: userId,
        security_answer: answer,
        new_password: newPassword
      });

      alert("✅ Password reset successful");
      window.location.href = "/login";

    } catch (err) {
      alert("❌ Wrong answer or error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">

      <div className="bg-white/10 p-8 rounded-xl w-96">

        <h2 className="text-xl mb-4 text-center">🔐 Forgot Password</h2>

        <input
          placeholder="Enter User ID"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setUserId(e.target.value)}
        />

        <button
          onClick={getQuestion}
          className="w-full bg-blue-500 p-2 mb-3 rounded"
        >
          Get Security Question
        </button>

        {question && (
          <>
            <p className="mb-2">❓ {question}</p>

            <input
              placeholder="Your Answer"
              className="w-full p-2 mb-3 text-black rounded"
              onChange={(e) => setAnswer(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-3 text-black rounded"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-500 p-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}

      </div>
    </div>
  );
}