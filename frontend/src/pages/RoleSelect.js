import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black to-gray-900 text-white">

      <div className="flex gap-10">

        {/* USER */}
        <div
          onClick={() => navigate("/login")}
          className="cursor-pointer bg-blue-500/20 p-10 rounded-2xl hover:scale-110 transition text-center"
        >
          <h2 className="text-3xl mb-2">👤 User</h2>
          <p>Login / Signup</p>
        </div>

        {/* ADMIN */}
        <div
          onClick={() => navigate("/admin-login")}
          className="cursor-pointer bg-red-500/20 p-10 rounded-2xl hover:scale-110 transition text-center"
        >
          <h2 className="text-3xl mb-2">🛠 Admin</h2>
          <p>Admin Login</p>
        </div>

      </div>
    </div>
  );
}