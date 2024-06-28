"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUser, setToken, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { toast } from "sonner";

const useAuthSession = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get("/api/auth/user/session", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            toast.success("Session Verified");
            dispatch(setUser(response.data.user));
            dispatch(setToken(token));
          } else {
            // If the session is invalid, clear the authentication
            toast.error("Your session has expired");
            dispatch(clearAuth());
            localStorage.removeItem("authToken");
          }
        } else {
          // If no token is found, clear the authentication
          dispatch(clearAuth());
        }
      } catch (error) {
        toast.error("Failed to check user session");
        console.error("Failed to check user session", error);
        localStorage.removeItem("authToken");
        // Clear the authentication in case of an error
        dispatch(clearAuth());
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [dispatch]);

  return { user, loading };
};

export default useAuthSession;