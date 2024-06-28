"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import toast from "react-hot-toast";
import { clearAuth } from "@/redux/auth/auth.slice";
import { useAppDispatch } from "@/redux/store";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    try {
      toast.loading("Registering...");
      const response = await axios.post("/api/auth/user/register", {
        email,
        username,
        password,
      });

      if (response.data.success) {
        setEmail("");
        setUsername("");
        setPassword("");
        toast.dismiss();
        toast.success("Registered successfully!");
        router.push("/");
      } else {
        toast.dismiss();
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    dispatch(clearAuth());
    // window.location.href = "/";
    window.location.assign("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 mt-4 border rounded-md"
          />
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
            onClick={handleRegister}
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
          >
            Register
          </button>

          <div className="mt-4 text-center text-gray-500">OR</div>
          <button
            onClick={handleLoginRedirect}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
