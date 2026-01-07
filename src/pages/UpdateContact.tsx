import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./Stepper";

const UpdateContact = () => {
  const navigate = useNavigate();
  const type = sessionStorage.getItem("otpType");

  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (type === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        setError("Enter a valid email address");
        return false;
      }
    }

    if (type === "mobile") {
      if (!/^[6-9]\d{9}$/.test(input)) {
        setError("Enter valid 10-digit mobile number");
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    sessionStorage.clear();
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow my-36">
      <Stepper currentStep={3} />

      <h2 className="text-lg font-bold text-[#E42128] mb-4 text-center">
        Update {type === "email" ? "Email" : "Mobile Number"}
      </h2>

      <input
        type={type === "email" ? "email" : "tel"}
        placeholder={
          type === "email"
            ? "Enter new email address"
            : "Enter new mobile number"
        }
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError("");
        }}
        className={`w-full border rounded-lg px-4 py-2 mb-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleUpdate}
        className="w-full bg-[#E42128] text-white py-2 rounded-lg"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateContact;
