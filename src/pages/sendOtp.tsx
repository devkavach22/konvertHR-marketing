import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp } from "./SubScriptionService";

const SendOtp: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { type, value: initialValue } = state || {};

  const [value, setValue] = useState(initialValue || "");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSendOtp = async () => {
    if (!value) return alert("Value is required");

    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return alert("Invalid email");
    }

    if (type === "mobile" && value.length < 10) {
      return alert("Invalid mobile number");
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
      alert("Failed to send OTP");
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
