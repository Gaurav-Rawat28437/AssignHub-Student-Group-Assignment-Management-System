import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../services/authService";
import { logout } from "../utils/userSlice";

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
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutButton;