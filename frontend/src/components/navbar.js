import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const hiddenRoutes = [
    "/admin",
    "/admin-login",
    "/manage-users",
    "/manage-feedback"
  ];

  if (
    hiddenRoutes.includes(
      location.pathname
    )
  ) {
    return null;
  }

  const loggedIn =
    localStorage.getItem("user");

  return (
    <div className="flex justify-between items-center px-8 py-5 bg-black border-b border-white/10 text-white">

      {/* Logo */}
      <h1 className="text-4xl font-bold text-pink-500">
        📚 ReadAware
      </h1>

      {/* Menu */}
      <div className="flex items-center gap-8 text-lg">

        <Link to="/home">Home</Link>

        <Link to="/content">
          Discover
        </Link>

        <Link to="/mood">Mood</Link>

        <Link to="/popular">
          Popular
        </Link>

        <Link to="/collaborative">Collaborative</Link>

        <Link to="/hybrid">
          Hybrid
        </Link>

        <Link to="/library">
          My Library
        </Link>

        {loggedIn && (
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        )}

      </div>
    </div>
  );
}