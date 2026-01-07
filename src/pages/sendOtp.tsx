import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp } from "./SubScriptionService";
import { useToast } from "../components/common/ToastContext";

const SendOtp: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();
  const { type, value: initialValue } = state || {};

  const [value, setValue] = useState(initialValue || "");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSendOtp = async () => {
    if (!value) {
      showToast("Value is required", "error");
      return;
    }

    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showToast("Invalid email", "error");
      return;
    }

    if (type === "mobile" && value.length < 10) {
      showToast("Invalid mobile number", "error");
      return;
    }

    try {
      setLoading(true);
      await sendOtp({
        user_id: userId!,
        type,
        value,
      });

      navigate("/verify-otp", { state: { type, value } });
    } catch {
      showToast("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Change {type === "email" ? "Email" : "Mobile"}
      </h2>

      <input
        className="w-full border px-4 py-2 rounded mb-4"
        placeholder={`Enter new ${type}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full bg-[#E42128] text-white py-2 rounded"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  );
};


export default SendOtp;
