"use client";

import { useState } from "react";
import { setToken, setUser } from "@/redux/auth/auth.slice";
import { useAppDispatch } from "@/redux/store";
import { clearAuth } from "@/redux/auth/auth.slice";
import useAuthSession from "@/hooks/useAuthSession";
import axios from "axios";
// import { toast } from "sonner";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { user, loading } = useAuthSession();

  const handleLogin = async () => {
    try {
      toast.loading("Logging in...");
      const response = await axios.post("/api/auth/user/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        dispatch(setToken(response.data.authToken));
        dispatch(setUser({ username: response.data.username }));
        setUsername("");
        setPassword("");
        toast.dismiss();
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.error ||
            "An error occurred during login. Please try again."
        );
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/auth/user/logout");
      if (response.data.success) {
        toast.success("Logged Out!");
        dispatch(clearAuth());
        // console.log("User after logout:", user);
        console.log(user);
        localStorage.removeItem("authToken");
        console.log(user);
      } else {
        alert(response.data.error || "Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register";
    // window.location.assign('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {loading && <div className="text-center">Checking Session...</div>}
        {user && (
          <div>
            <h2 className="text-2xl text-center font-bold text-green-600">
              Welcome, {user.username}
            </h2>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
        {user === null && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
            <div className="mt-4 text-center text-gray-500">OR</div>
            <button
              onClick={handleRegisterRedirect}
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded-md"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
