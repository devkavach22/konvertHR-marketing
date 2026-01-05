/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

export interface AuthContextType {
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Get userId from localStorage if available
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId")
      ? parseInt(localStorage.getItem("userId")!)
      : null
  );

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await axiosInstance.post("/api/login", { email, password });
      const { user_id, message } = res.data;

      if (!user_id) throw new Error("Login failed");

      // Save userId to localStorage
      localStorage.setItem("userId", user_id.toString());

      // Update state
      setUserId(user_id);

      toast.success(message || "✅ Login successful!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "❌ Login failed");
      throw err; // allow caller to handle
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    toast.info("You’ve been logged out.");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
