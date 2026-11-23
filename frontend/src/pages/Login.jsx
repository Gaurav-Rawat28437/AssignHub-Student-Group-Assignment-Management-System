import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";
import { setUser } from "../utils/userSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@assignhub.com");
    const [password, setPassword] = useState("Admin@123");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await loginUser({ email, password });

            dispatch(setUser(response.user));

            toast.success(response.message || "Login successful!");

            if (response.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/student");
            }

        } catch (error) {
            const message =
                error.response?.data?.message || "Something went wrong";

            setError(message);
            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-gray-800">
                    AssignHub
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Login to your account
                </p>

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                        Register now
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Login;
