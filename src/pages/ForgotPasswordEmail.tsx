/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "../components/common/ToastContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordEmail() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast("⚠️ Please enter your email.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showToast("Invalid email format.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/forgot-password/request", {
        email,
      });

      // ⛔ HANDLE backend error even if 200 OK
      if (res.data.status === "error") {
        showToast(res.data.message || "Failed to send reset email.", "error");
        setLoading(false);
        return; // ⛔ STOP navigation
      }

      showToast(res.data.message || "📨 Reset email sent!", "success");

      navigate(`/forgot-password/reset?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to send reset email.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleSendMail} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E42128] text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
