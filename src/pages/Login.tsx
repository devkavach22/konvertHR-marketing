/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/common/ToastContext";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = passwordRef.current?.value || "";

    // --- 1. Empty Field Validation ---
    if (!email.trim()) {
      showToast("Please enter your email address.", "error");
      return;
    }

    // --- 2. Email Format Check ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Invalid email format. Example: user@domain.com", "error");
      return;
    }

    if (!password) {
      showToast("Please enter your password.", "error");
      return;
    }

    // --- 3. Strict Password Complexity Check ---
    // We check these sequentially to show the specific error to the user

    // Check Length (8-32 characters as per your request + safe limit)
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long.", "error");
      return;
    }

    // Check Uppercase
    if (!/[A-Z]/.test(password)) {
      showToast(
        "Password must contain at least 1 Capital letter (A-Z).",
        "error",
      );
      return;
    }

    // Check Lowercase
    if (!/[a-z]/.test(password)) {
      showToast(
        "Password must contain at least 1 Small letter (a-z).",
        "error",
      );
      return;
    }

    // Check Number
    if (!/[0-9]/.test(password)) {
      showToast(
        "Password must contain at least 1 Numeric digit (0-9).",
        "error",
      );
      return;
    }

    // Check Special Character (! @ # $ % ^ & *)
    if (!/[!@#$%^&*]/.test(password)) {
      showToast(
        "Password must contain at least 1 Special character (!@#$%^&*).",
        "error",
      );
      return;
    }

    // --- 4. Attempt Login ---
    setLoading(true);

    try {
      await login(email, password);

      // Clear sensitive data from inputs
      if (passwordRef.current) passwordRef.current.value = "";

      showToast("Login successful! Redirecting...", "success");
      navigate("/pricing");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // --- 5. Handle Server Errors ---
      // If the backend sends "User not found" or "Wrong password", display it here
      const serverMsg = err.response?.data?.message || err.message;
      const displayMsg =
        serverMsg || "Login failed. Please check your credentials.";

      showToast(displayMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md border border-[#E42128]/10">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Login to your{" "}
          <span className="text-[#E42128] font-semibold">Konvert HR</span>{" "}
          dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative group">
            <Mail
              className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#E42128] transition-colors"
              size={18}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              maxLength={64} // Input Limit
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128] outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock
              className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#E42128] transition-colors"
              size={18}
            />
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              maxLength={32} // Input Limit (Strict limit prevents buffer overflow attacks and copy-paste errors)
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128] outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-[#E42128] cursor-pointer"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[#E42128] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E42128] text-white py-3 rounded-lg font-semibold 
            hover:bg-[#c91d22] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#E42128] font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useRef } from "react";
// import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "../components/common/ToastContext";
// import { useAuth } from "../context/useAuth";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { showToast } = useToast();

//   const [email, setEmail] = useState("");
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const password = passwordRef.current?.value || "";

//     if (!email || !password) {
//       showToast("⚠️ Please fill in all fields.", "error");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       showToast("Invalid email format.", "error");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Call login from AuthContext
//       await login(email, password);

//       // Clear password after login attempt
//       if (passwordRef.current) {
//         passwordRef.current.value = "";
//       }

//       // Navigate to checkout after successful login
//       navigate("/pricing");
//     } catch (err) {
//       // Error already handled by toast in AuthContext
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] px-6">
//       <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md border border-[#E42128]/10">
//         <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
//           Welcome Back 👋
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           Login to your{" "}
//           <span className="text-[#E42128] font-semibold">Konvert HR</span>{" "}
//           dashboard
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="relative">
//             <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2
//               focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
//             <input
//               ref={passwordRef}
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               autoComplete="current-password"
//               className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-4 py-2
//               focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Options */}
//           <div className="flex justify-between items-center text-sm text-gray-600">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="accent-[#E42128]" />
//               Remember me
//             </label>
//             <Link
//               to="/forgot-password"
//               className="text-[#E42128] hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#E42128] text-white py-3 rounded-lg font-semibold
//             hover:bg-[#c91d22] transition-all disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 text-sm mt-6">
//           Don’t have an account?{" "}
//           <Link
//             to="/register"
//             className="text-[#E42128] font-semibold hover:underline"
//           >
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
