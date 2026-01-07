import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp } from "./SubScriptionService";

const SendOtp: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { type, value, pendingProfileData } = state || {};

  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSendOtp = async () => {
    if (!value) {
      alert("Value is required");
      return;
    }

    try {
      setLoading(true);

      await sendOtp({
        user_id: userId!,
        type,
        value,
      });

      navigate("/verify-otp", {
        state: {
          type,
          value,
          pendingProfileData, // ⭐ pass full profile data
        },
      });
    } catch (error) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">
        Verify {type === "email" ? "Email" : "Mobile"}
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        OTP will be sent to <b>{value}</b>
      </p>

      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full bg-[#E42128] text-white py-2 rounded"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
};

export default SendOtp;
