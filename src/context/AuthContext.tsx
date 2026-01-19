/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, type ReactNode, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

export interface AuthContextType {
  userId: number | null;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId")
      ? parseInt(localStorage.getItem("userId")!)
      : null,
  );

  // ✅ FIX: Removed try/catch block.
  // Errors from axiosInstance will automatically bubble up to the component calling login().
  const login = async (email: string, password: string): Promise<string> => {
    const res = await axiosInstance.post("/api/Marketing/pageLogin", {
      email,
      password,
    });

    const { message } = res.data;

    const {
      user_id,
      token,
      full_name,
      email: userEmail,
      mobile,
      company_name,
      gst_number,
      street,
      street2,
      city,
      pincode,
      image,
    } = res.data;

    if (!user_id) throw new Error("Login failed: User ID missing");

    // 🔐 Save auth data
    localStorage.setItem("userId", user_id.toString());
    localStorage.setItem("token", token);

    // 👤 Save profile data
    localStorage.setItem(
      "profile",
      JSON.stringify({
        first_name: full_name?.split(" ")[0] || "",
        last_name: full_name?.split(" ").slice(1).join(" ") || "",
        email: userEmail,
        mobile,
        company_name,
        gst_number,
        street,
        street2,
        city,
        pincode,
        image,
      }),
    );

    setUserId(user_id);

    return message || "Login successful!";
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createContext, useState, type ReactNode } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../api/axiosInstance";

// export interface AuthContextType {
//   userId: number | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// // Create context
// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined,
// );

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // Get userId from localStorage if available
//   const [userId, setUserId] = useState<number | null>(
//     localStorage.getItem("userId")
//       ? parseInt(localStorage.getItem("userId")!)
//       : null,
//   );

//   // Login function
//   const login = async (email: string, password: string): Promise<void> => {
//     try {
//       // const res = await axiosInstance.post("/api/login", { email, password });
//       const res = await axiosInstance.post("/api/Marketing/pageLogin", {
//         email,
//         password,
//       });

//       const { message } = res.data;

//       const {
//         user_id,
//         token,
//         full_name,
//         email: userEmail,
//         mobile,
//         company_name,
//         gst_number,
//         street,
//         street2,
//         city,
//         pincode,
//         image,
//       } = res.data;

//       if (!user_id) throw new Error("Login failed");

//       // 🔐 Save auth data
//       localStorage.setItem("userId", user_id.toString());
//       localStorage.setItem("token", token);

//       // 👤 Save profile data (for edit profile default values)
//       localStorage.setItem(
//         "profile",
//         JSON.stringify({
//           first_name: full_name?.split(" ")[0] || "",
//           last_name: full_name?.split(" ").slice(1).join(" ") || "",
//           email: userEmail,
//           mobile,
//           company_name,
//           gst_number,
//           street,
//           street2,
//           city,
//           pincode,
//           image,
//         }),
//       );
//       setUserId(user_id);

//       toast.success(message || "✅ Login successful!");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "❌ Login failed");
//       throw err; // allow caller to handle
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("userId");
//     setUserId(null);
//     toast.info("You’ve been logged out.");
//   };

//   return (
//     <AuthContext.Provider value={{ userId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
