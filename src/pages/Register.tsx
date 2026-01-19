/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as yup from "yup";
import {
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  FileText,
  Globe,
  MapPin,
  Home,
  EyeOff,
  Eye,
  Loader2, // Imported Loader icon
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../components/common/ToastContext";
import { useNavigate } from "react-router-dom";

// --- Types ---
interface RegisterFormData {
  fullName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  gst: string;
  phone: string;
  address: string;
  street: string;
  street2: string;
  pincode: string;
  city: string;
  country: string;
  country_id: number;
  state: string;
  state_id: number;
  designation: string;
}

// --- Validation Constants ---
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Password Regex: 1 Upper, 1 Lower, 1 Number, 1 Special, Min 8 Chars
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// --- Schema ---
const schema = yup.object({
  gst: yup
    .string()
    .required("GST is required")
    .matches(gstRegex, "Invalid GST format. Eg: 24ABCDE1234F1Z5"),
  company: yup.string().required("Company name is required"),
  fullName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid Email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  designation: yup.string().required("Designation is required"),
  address: yup.string().required("Company Address is required"),
  street: yup.string().required("Street is required"),
  street2: yup.string().required("Street 2 is required"),
  city: yup.string().required("City is required"),
  pincode: yup.string().required("Pincode is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  country_id: yup.number().required(),
  state_id: yup.number().required(),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must be 8+ chars, with 1 Uppercase, 1 Lowercase, 1 Number & 1 Special Char",
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});

export default function Register() {
  const [isGSTVerified, setIsGSTVerified] = useState(false);
  const [isVerifyingGST, setIsVerifyingGST] = useState(false); // GST Loading State
  const [isRegistering, setIsRegistering] = useState(false); // Register Loading State
  const [autoFilledFields, setAutoFilledFields] = useState<
    (keyof RegisterFormData)[]
  >([]);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      country_id: 0,
      state_id: 0,
    },
  });

  // ---------------- GST Verify Logic ----------------
  const verifyGST = async () => {
    const gst = getValues("gst");

    if (!gst) {
      showToast("Please enter a GST number first.", "error");
      return;
    }

    if (!gstRegex.test(gst)) {
      showToast("Invalid GST format. Please check again.", "error");
      return;
    }

    setIsVerifyingGST(true);

    try {
      const res = await axiosInstance.post(`api/check_gstnumber`, {
        gst_number: gst,
      });

      if (res?.data?.status === "ok") {
        const details = res?.data?.company_details?.[0];
        const filled: (keyof RegisterFormData)[] = [];

        // Auto-fill logic
        if (details?.name) {
          setValue("company", details.name);
          filled.push("company");
        }
        if (details?.city) {
          setValue("city", details.city);
          setValue("address", details.city);
          filled.push("city", "address");
        }
        if (details?.state) {
          setValue("state_id", details.state_id);
          setValue("state", details.state);
          filled.push("state_id");
        }
        if (details?.country_id) {
          setValue("country_id", details.country_id.id);
          setValue("country", details.country_id.display_name);
          filled.push("country_id");
        }

        setAutoFilledFields(filled);
        setIsGSTVerified(true);
        showToast("GST Verified Successfully!", "success");
      } else {
        showToast(res?.data?.message || "GST details not found.", "error");
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "GST verification failed.",
        "error",
      );
    } finally {
      setIsVerifyingGST(false);
    }
  };

  // ---------------- Registration Submit Logic ----------------
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (!isGSTVerified) {
      showToast(
        "⚠️ Please verify your GST number before registering.",
        "warning",
      );
      return;
    }

    setIsRegistering(true); // Start Loader

    try {
      const res = await axiosInstance.post(`api/user/signup`, {
        first_name: data.fullName,
        last_name: data.lastName,
        company_address: data.address,
        company_name: data.company,
        gst_number: data.gst,
        mobile: data.phone,
        email: data.email,
        designation: data.designation,
        street: data.street,
        street2: data.street2,
        pincode: data.pincode,
        state_id: data.state_id,
        country_id: data.country_id,
        city: data.city,
        password: data.password,
      });

      // Check for success status (200 or 201)
      if (res.status === 200 || res.status === 201) {
        showToast(
          "Registration Successful! Redirecting to login...",
          "success",
        );

        // Wait 1.5s so user can see the success message
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(res?.data?.message || "Registration failed.", "error");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      showToast(`❌ ${errorMsg}`, "error");
    } finally {
      setIsRegistering(false); // Stop Loader
    }
  };

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-[#FFF5F5] px-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-3xl border border-[#E42128]/10">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
          Create Your Konvert HR Account
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Fill in your details below
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* --- GST Section --- */}
          <div className="md:col-span-2 flex gap-3 items-start">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3.5 text-[#E42128]">
                <FileText size={20} />
              </div>
              <input
                type="text"
                placeholder="GST Number *"
                {...register("gst")}
                disabled={isGSTVerified}
                maxLength={15} // Standard GST Length
                className={`w-full pl-10 border rounded-lg px-4 py-3 outline-none transition-all
                  focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]
                  disabled:bg-gray-100 disabled:text-gray-500
                  ${errors.gst ? "border-red-500 bg-red-50" : "border-gray-300"}
                `}
              />
              {errors.gst && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.gst.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={verifyGST}
              disabled={isVerifyingGST || isGSTVerified}
              className={`h-[50px] px-6 rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center min-w-[120px] ${
                isGSTVerified
                  ? "bg-green-600 cursor-default"
                  : isVerifyingGST
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#E42128] hover:bg-[#c91d22] hover:shadow-lg"
              }`}
            >
              {isGSTVerified ? (
                "Verified ✓"
              ) : isVerifyingGST ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify"
              )}
            </button>
          </div>

          {/* --- Form Fields --- */}
          {/* Note: Added maxLength to all inputs for security/QA */}
          <InputField
            icon={<Briefcase size={20} />}
            reg={register("company")}
            placeholder="Company Name *"
            disabled={autoFilledFields.includes("company")}
            error={errors.company}
            className="md:col-span-2"
            maxLength={100}
          />

          <InputField
            icon={<User size={20} />}
            reg={register("fullName")}
            placeholder="First Name *"
            disabled={!isGSTVerified}
            error={errors.fullName}
            maxLength={50}
          />

          <InputField
            icon={<User size={20} />}
            reg={register("lastName")}
            placeholder="Last Name *"
            disabled={!isGSTVerified}
            error={errors.lastName}
            maxLength={50}
          />

          <InputField
            icon={<Mail size={20} />}
            reg={register("email")}
            placeholder="Email Address *"
            disabled={!isGSTVerified}
            error={errors.email}
            maxLength={80}
          />

          <InputField
            icon={<Phone size={20} />}
            reg={register("phone")}
            placeholder="Mobile Number *"
            disabled={!isGSTVerified}
            error={errors.phone}
            maxLength={10}
          />

          <InputField
            icon={<Briefcase size={20} />}
            reg={register("designation")}
            placeholder="Designation *"
            disabled={!isGSTVerified}
            error={errors.designation}
            maxLength={50}
          />

          <InputField
            icon={<Home size={20} />}
            reg={register("address")}
            placeholder="Company Address *"
            disabled={autoFilledFields.includes("address")}
            error={errors.address}
            maxLength={150}
          />

          <InputField
            icon={<Home size={20} />}
            reg={register("street")}
            placeholder="Street *"
            disabled={!isGSTVerified}
            error={errors.street}
            maxLength={100}
          />

          <InputField
            icon={<Home size={20} />}
            reg={register("street2")}
            placeholder="Street 2 *"
            disabled={!isGSTVerified}
            error={errors.street2}
            maxLength={100}
          />

          <InputField
            icon={<MapPin size={20} />}
            reg={register("city")}
            placeholder="City *"
            disabled={autoFilledFields.includes("city")}
            error={errors.city}
            maxLength={60}
          />

          <InputField
            icon={<MapPin size={20} />}
            reg={register("pincode")}
            placeholder="Pincode *"
            disabled={!isGSTVerified}
            error={errors.pincode}
            maxLength={10}
          />

          <InputField
            icon={<Globe size={20} />}
            reg={register("country")}
            placeholder="Country *"
            disabled={autoFilledFields.includes("country_id")}
            error={errors.country}
            maxLength={60}
          />

          <InputField
            icon={<MapPin size={20} />}
            reg={register("state")}
            placeholder="State *"
            disabled={autoFilledFields.includes("state_id")}
            error={errors.state}
            maxLength={60}
          />

          <PasswordField
            reg={register("password")}
            placeholder="Password *"
            disabled={!isGSTVerified}
            error={errors.password}
          />

          <PasswordField
            reg={register("confirmPassword")}
            placeholder="Confirm Password *"
            disabled={!isGSTVerified}
            error={errors.confirmPassword}
          />

          {/* --- Submit Button with Loader --- */}
          <button
            type="submit"
            disabled={!isGSTVerified || isRegistering}
            className="md:col-span-2 w-full bg-[#E42128] hover:bg-[#c91d22] text-white py-3.5 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
          >
            {isRegistering ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Creating Account...</span>
              </>
            ) : (
              "Register Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Input Components (Refined for QA)
-------------------------------------------------- */
function InputField({
  icon,
  reg,
  placeholder,
  disabled,
  error,
  className,
  maxLength = 60,
}: any) {
  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute left-3 top-3.5 text-[#E42128]">{icon}</div>
      <input
        {...reg}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full pl-10 border rounded-lg px-4 py-3 outline-none transition-all
          focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
        `}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}

function PasswordField({ reg, placeholder, disabled, error }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-3 top-3.5 text-[#E42128]">
        <Lock size={20} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        {...reg}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={32} // Strict Limit for Password
        className={`w-full pl-10 pr-10 border rounded-lg px-4 py-3 outline-none transition-all
          focus:ring-2 focus:ring-[#E42128] focus:border-[#E42128]
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
        `}
      />

      <div
        className={`absolute right-3 top-3.5 transition-colors ${disabled ? "text-gray-300" : "text-gray-400 hover:text-gray-600 cursor-pointer"}`}
        onClick={() => !disabled && setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import * as yup from "yup";
// import {
//   Mail,
//   Lock,
//   User,
//   Phone,
//   Briefcase,
//   FileText,
//   Globe,
//   MapPin,
//   Home,
//   EyeOff,
//   Eye,
// } from "lucide-react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axiosInstance from "../api/axiosInstance";
// import { useToast } from "../components/common/ToastContext";
// import { useNavigate } from "react-router-dom";

// interface RegisterFormData {
//   fullName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   company: string;
//   gst: string;
//   phone: string;
//   address: string;
//   street: string;
//   street2: string;
//   pincode: string;
//   city: string;
//   country: string;
//   country_id: number;
//   state: string;
//   state_id: number;
//   designation: string;
// }

// const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// const schema = yup.object({
//   fullName: yup.string().required("First Name is required"),
//   lastName: yup.string().required("Last Name is required"),
//   email: yup.string().email("Invalid Email").required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Minimum 6 characters")
//     .required("Password required"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("password")], "Password mismatch")
//     .required("Confirm password"),
//   gst: yup
//     .string()
//     .required("GST is required")
//     .matches(gstRegex, "Invalid GST format. Eg: 24ABCDE1234F1Z5"),
//   phone: yup
//     .string()
//     .matches(/^\d{10}$/, "Must be 10 digits")
//     .required("Mobile required"),
//   designation: yup.string().required("Designation required"),
//   company: yup.string().required("Company name is required"),
//   address: yup.string().required("Company Address required"),
//   street: yup.string().required("Street is required"),
//   street2: yup.string().required("Street2 is required"),
//   pincode: yup.string().required("Pincode is required"),
//   city: yup.string().required("City required"),
//   country_id: yup.number().required("Country is required"),
//   state_id: yup.number().required("State is required"),
//   country: yup.string().required("Country is required"),
//   state: yup.string().required("State is required"),
// });

// export default function Register() {
//   const [isGSTVerified, setIsGSTVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [autoFilledFields, setAutoFilledFields] = useState<
//     (keyof RegisterFormData)[]
//   >([]);

//   const navigate = useNavigate();
//   const { showToast } = useToast(); // <-- USE TOASTER

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       country_id: 0,
//       state_id: 0,
//     },
//   });

//   // ---------------- GST Verify ----------------
//   const verifyGST = async () => {
//     const gst = getValues("gst");

//     if (!gst) return showToast("GST cannot be empty", "error");

//     if (!gstRegex.test(gst)) {
//       return showToast("Invalid GST format. Eg: 24ABCDE1234F1Z5", "error");
//     }

//     setIsVerifying(true);

//     try {
//       const res = await axiosInstance.post(`api/check_gstnumber`, {
//         gst_number: gst,
//       });

//       if (res?.data?.status === "ok") {
//         const details = res?.data?.company_details?.[0];
//         const filled: (keyof RegisterFormData)[] = [];

//         if (details?.name) {
//           setValue("company", details.name);
//           filled.push("company");
//         }
//         if (details?.city) {
//           setValue("city", details.city);
//           setValue("address", details.city);
//           filled.push("city", "address");
//         }
//         if (details?.state) {
//           setValue("state_id", details.state_id);
//           setValue("state", details.state);
//           filled.push("state_id");
//         }
//         if (details?.country_id) {
//           setValue("country_id", details.country_id.id);
//           setValue("country", details.country_id.display_name);
//           filled.push("country_id");
//         }

//         setAutoFilledFields(filled);
//         setIsGSTVerified(true);

//         showToast(res?.data?.message || "GST Verified!", "success");
//       } else {
//         showToast(res?.data?.message || "GST Not Found", "error");
//       }
//     } catch (err: any) {
//       showToast(
//         err?.response?.data?.message || "GST verification failed",
//         "error",
//       );
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // ---------------- Register Submit ----------------
//   const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
//     if (!isGSTVerified)
//       return showToast("Verify GST first before registering!", "warning");

//     try {
//       const res = await axiosInstance.post(`api/user/signup`, {
//         first_name: data.fullName,
//         last_name: data.lastName,
//         company_address: data.address,
//         company_name: data.company,
//         gst_number: data.gst,
//         mobile: data.phone,
//         email: data.email,
//         designation: data.designation,
//         street: data.street,
//         street2: data.street2,
//         pincode: data.pincode,
//         state_id: data.state_id,
//         country_id: data.country_id,
//         city: data.city,
//         password: data.password,
//       });

//       // ✅ Show backend message (fallback to default)
//       showToast(res?.data?.message || "Registration Successful!", "success");

//       // 👉 Redirect to Checkout
//       setTimeout(() => {
//         navigate("/checkout");
//       }, 800);
//     } catch (error: any) {
//       showToast(
//         error?.response?.data?.message || "Registration failed",
//         "error",
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen py-24 flex items-center justify-center bg-[#FFF5F5] px-6">
//       <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-3xl border border-[#E42128]/10">
//         <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
//           Create Your Konvert HR Account
//         </h2>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 md:grid-cols-2 gap-5"
//         >
//           {/* GST */}
//           <div className="md:col-span-2 flex gap-2">
//             <div className="relative flex-1">
//               <FileText className="absolute left-3 top-3 text-[#E42128]" />
//               <input
//                 type="text"
//                 placeholder="GST Number *"
//                 {...register("gst")}
//                 disabled={isGSTVerified}
//                 className={`floating-input ${errors.gst ? "error" : ""} w-full`}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={verifyGST}
//               disabled={isVerifying || isGSTVerified}
//               className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
//                 isGSTVerified
//                   ? "bg-green-500"
//                   : isVerifying
//                     ? "bg-gray-400"
//                     : "bg-[#E42128] hover:bg-[#c91d22]"
//               }`}
//             >
//               {isGSTVerified
//                 ? "Verified"
//                 : isVerifying
//                   ? "Verifying..."
//                   : "Verify"}
//             </button>
//           </div>

//           {/* Other Fields */}
//           <InputField
//             icon={<Briefcase />}
//             reg={register("company")}
//             placeholder="Company Name *"
//             disabled={autoFilledFields.includes("company")}
//             error={errors.company}
//             className="md:col-span-2"
//           />

//           <InputField
//             icon={<User />}
//             reg={register("fullName")}
//             placeholder="First Name *"
//             disabled={!isGSTVerified}
//             error={errors.fullName}
//           />

//           <InputField
//             icon={<User />}
//             reg={register("lastName")}
//             placeholder="Last Name *"
//             disabled={!isGSTVerified}
//             error={errors.lastName}
//           />

//           <InputField
//             icon={<Mail />}
//             reg={register("email")}
//             placeholder="Email *"
//             disabled={!isGSTVerified}
//             error={errors.email}
//           />

//           <InputField
//             icon={<Phone />}
//             reg={register("phone")}
//             placeholder="Mobile *"
//             disabled={!isGSTVerified}
//             error={errors.phone}
//           />

//           <InputField
//             icon={<Briefcase />}
//             reg={register("designation")}
//             placeholder="Designation *"
//             disabled={!isGSTVerified}
//             error={errors.designation}
//           />

//           <InputField
//             icon={<Home />}
//             reg={register("address")}
//             placeholder="Company Address *"
//             disabled={autoFilledFields.includes("address")}
//             error={errors.address}
//           />

//           <InputField
//             icon={<Home />}
//             reg={register("street")}
//             placeholder="Street *"
//             disabled={!isGSTVerified}
//             error={errors.street}
//           />

//           <InputField
//             icon={<Home />}
//             reg={register("street2")}
//             placeholder="Street 2 *"
//             disabled={!isGSTVerified}
//             error={errors.street2}
//           />

//           <InputField
//             icon={<MapPin />}
//             reg={register("city")}
//             placeholder="City *"
//             disabled={autoFilledFields.includes("city")}
//             error={errors.city}
//           />

//           <InputField
//             icon={<MapPin />}
//             reg={register("pincode")}
//             placeholder="Pincode *"
//             disabled={!isGSTVerified}
//             error={errors.pincode}
//           />

//           <InputField
//             icon={<Globe />}
//             reg={register("country")}
//             placeholder="Country *"
//             disabled={autoFilledFields.includes("country_id")}
//             error={errors.country}
//           />

//           <InputField
//             icon={<MapPin />}
//             reg={register("state")}
//             placeholder="State *"
//             disabled={autoFilledFields.includes("state_id")}
//             error={errors.state}
//           />

//           <PasswordField
//             reg={register("password")}
//             placeholder="Password *"
//             disabled={!isGSTVerified}
//             error={errors.password}
//           />

//           <PasswordField
//             reg={register("confirmPassword")}
//             placeholder="Confirm Password *"
//             disabled={!isGSTVerified}
//             error={errors.confirmPassword}
//           />

//           <button
//             type="submit"
//             disabled={!isGSTVerified}
//             className="md:col-span-2 w-full bg-[#E42128] hover:bg-[#c91d22] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* --------------------------------------------------
//    Input Components
// -------------------------------------------------- */
// function InputField({
//   icon,
//   reg,
//   placeholder,
//   disabled,
//   error,
//   className,
// }: any) {
//   return (
//     <div className={`relative ${className || ""}`}>
//       <div className="absolute left-3 top-3 text-[#E42128]">{icon}</div>
//       <input
//         {...reg}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={`floating-input ${error ? "error" : ""} w-full`}
//       />
//       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
//     </div>
//   );
// }

// function PasswordField({ reg, placeholder, disabled, error }: any) {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="relative">
//       <Lock className="absolute left-3 top-3 text-[#E42128]" />
//       <input
//         type={showPassword ? "text" : "password"}
//         {...reg}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={`floating-input ${error ? "error" : ""} w-full pr-10`}
//       />

//       <div
//         className="absolute right-3 top-3 cursor-pointer text-[#E42128]"
//         onClick={() => setShowPassword(!showPassword)}
//       >
//         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//       </div>

//       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
//     </div>
//   );
// }
