import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../services/authService";
import { logout } from "../utils/userSlice";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      dispatch(logout());
      toast.success(response.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
  <button
    onClick={handleLogout}
    title="Logout"
    className="flex items-center gap-4 w-full min-w-[220px] px-3 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
  >
    <LogOut size={21} className="shrink-0" />

    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-medium">
      Logout
    </span>
  </button>
);
}

export default LogoutButton;