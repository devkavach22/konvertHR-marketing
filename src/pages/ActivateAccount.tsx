import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ActivateAccount() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  useEffect(() => {
    const pendingUser = JSON.parse(localStorage.getItem("pendingUser") || "null");

    if (pendingUser && pendingUser.email === email) {
      pendingUser.isActivated = true;
      localStorage.setItem("pendingUser", JSON.stringify(pendingUser));
      alert("✅ Account activated successfully!");
      navigate("/login");
    } else {
      alert("⚠️ Invalid or expired activation link.");
      navigate("/register");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-[#E42128]">
        Activating your account...
      </h2>
    </div>
  );
}
