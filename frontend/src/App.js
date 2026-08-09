import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";

import Content from "./pages/Content";
import Mood from "./pages/Mood";
import Hybrid from "./pages/Hybrid";
import Popularity from "./pages/Popularity";
import Collaborative from "./pages/Collaborative";

import MyLibrary from "./pages/MyLibrary";

import ProtectedRoute from "./components/ProtectedRoute";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import ManageUsers from "./pages/ManageUsers";
import ManageFeedback from "./pages/ManageFeedback";
import RoleSelect from "./pages/RoleSelect";
import PublicHeader from "./components/PublicHeader";

function AppRoutes() {
  const location = useLocation();

  const hideNavbarPages = [
    "/",
    "/login",
    "/signup",
    "/otp",
    "/forgot-password",
    "/admin-login"
  ];

  const hideNavbar = hideNavbarPages.includes(location.pathname);

  return (
    <>
      {hideNavbar ? <PublicHeader /> : <Navbar />}

      <Routes>

        {/* Public */}
        <Route path="/" element={<RoleSelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User */}
        <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
        <Route path="/popular" element={<ProtectedRoute><Popularity /></ProtectedRoute>} />
        <Route path="/hybrid" element={<ProtectedRoute><Hybrid /></ProtectedRoute>} />
        <Route path="/collaborative" element={<ProtectedRoute><Collaborative /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-feedback" element={<ManageFeedback />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;