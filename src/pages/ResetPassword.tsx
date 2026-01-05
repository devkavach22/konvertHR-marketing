/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Lock } from "lucide-react";
import { useToast } from "../components/common/ToastContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [params] = useSearchParams();

  const email = params.get("email") || "";

  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempPassword || !newPassword || !confirmPassword) {
      showToast("⚠️ All fields are required.", "error");
      return;
    }

    if (!validatePassword(newPassword)) {
      showToast(
        "Password must contain min 8 chars, uppercase, lowercase, number & special character.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/forgot-password/confirm", {
        email,
        temp_password: tempPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      // ⛔ FIX: handle backend error responses
      if (res.data.status === "error") {
        showToast(res.data.message || "Reset failed.", "error");
        setLoading(false);
        return; // stop navigation
      }

      showToast(res.data.message || "Password reset successful!", "success");
      navigate("/login");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Reset failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-4">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">
          {/* Temp Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Temporary Password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2"
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
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2"
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
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E42128] text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
