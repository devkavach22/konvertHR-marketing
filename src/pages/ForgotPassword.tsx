/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useToast } from "../components/common/ToastContext";
import axiosInstance from "../api/axiosInstance";
import { NavLink, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      showToast("⚠️ Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Invalid email format.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/forgot-password", {
        email,
        temp_password: tempPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      showToast(
        res.data.message || "✅ Password reset successfully!",
        "success"
      );
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.message || "❌ Password reset failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md border border-[#E42128]/10">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
          Forgot Password 🔑
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Reset your password for{" "}
          <span className="text-[#E42128] font-semibold">Konvert HR</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
            />
          </div>

          {/* Temporary Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Temporary Password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E42128] text-white py-3 rounded-lg font-semibold 
            hover:bg-[#c91d22] transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Remembered your password?{" "}
          <NavLink
            to="/login"
            className="text-[#E42128] font-semibold hover:underline"
          >
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
}
