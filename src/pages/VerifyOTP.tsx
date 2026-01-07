import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  verifyOtp,
  sendOtp,
  updateUserContact,
} from "./SubScriptionService";

const RESEND_TIMER = 30;

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { type, value, pendingProfileData } = state || {};

  console.log(pendingProfileData,"pendingProfileData");
  

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMER);

  const userId = localStorage.getItem("userId");
  const contactId = localStorage.getItem("contactId");

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      console.log("0000")

      // 1️⃣ Verify OTP
      await verifyOtp({
        type,
        value,
        otp,
      });
    console.log("1111")
      
console.log(userId,contactId,"lplpplp");

      navigate("/profile");
    } catch (error) {
      console.log(error)
      // alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    try {
      setTimer(RESEND_TIMER);
      await sendOtp({
        user_id: userId!,
        type,
        value,
      });
      alert("OTP resent successfully");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-4">
        OTP sent to <b>{value}</b>
      </p>

      <input
        className="w-full border px-4 py-2 rounded mb-3 text-center tracking-widest"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        maxLength={6}
      />

      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="w-full bg-[#E42128] text-white py-2 rounded"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {/* 🔁 RESEND */}
      <div className="text-center mt-4">
        {timer > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <b>{timer}s</b>
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-sm font-semibold text-[#E42128]"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
