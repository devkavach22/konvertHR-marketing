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
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../components/common/ToastContext";
import { useNavigate } from "react-router-dom";

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

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const schema = yup.object({
  fullName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password mismatch")
    .required("Confirm password"),
  gst: yup
    .string()
    .required("GST is required")
    .matches(gstRegex, "Invalid GST format. Eg: 24ABCDE1234F1Z5"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Must be 10 digits")
    .required("Mobile required"),
  designation: yup.string().required("Designation required"),
  company: yup.string().required("Company name is required"),
  address: yup.string().required("Company Address required"),
  street: yup.string().required("Street is required"),
  street2: yup.string().required("Street2 is required"),
  pincode: yup.string().required("Pincode is required"),
  city: yup.string().required("City required"),
  country_id: yup.number().required("Country is required"),
  state_id: yup.number().required("State is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
});

export default function Register() {
  const [isGSTVerified, setIsGSTVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<
    (keyof RegisterFormData)[]
  >([]);

  const navigate = useNavigate();
  const { showToast } = useToast(); // <-- USE TOASTER

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      country_id: 0,
      state_id: 0,
    },
  });

  // ---------------- GST Verify ----------------
  const verifyGST = async () => {
    const gst = getValues("gst");

    if (!gst) return showToast("GST cannot be empty", "error");

    if (!gstRegex.test(gst)) {
      return showToast("Invalid GST format. Eg: 24ABCDE1234F1Z5", "error");
    }

    setIsVerifying(true);

    try {
      const res = await axiosInstance.post(`api/check_gstnumber`, {
        gst_number: gst,
      });

      if (res?.data?.status === "ok") {
        const details = res?.data?.company_details?.[0];
        const filled: (keyof RegisterFormData)[] = [];

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

        showToast(res?.data?.message || "GST Verified!", "success");
      } else {
        showToast(res?.data?.message || "GST Not Found", "error");
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "GST verification failed",
        "error"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------- Register Submit ----------------
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (!isGSTVerified)
      return showToast("Verify GST first before registering!", "warning");

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

      // ✅ Show backend message (fallback to default)
      showToast(res?.data?.message || "Registration Successful!", "success");

      // 👉 Redirect to Checkout
      setTimeout(() => {
        navigate("/checkout");
      }, 800);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-[#FFF5F5] px-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-3xl border border-[#E42128]/10">
        <h2 className="text-3xl font-bold text-[#E42128] text-center mb-2">
          Create Your Konvert HR Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* GST */}
          <div className="md:col-span-2 flex gap-2">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-3 text-[#E42128]" />
              <input
                type="text"
                placeholder="GST Number *"
                {...register("gst")}
                disabled={isGSTVerified}
                className={`floating-input ${errors.gst ? "error" : ""} w-full`}
              />
            </div>

            <button
              type="button"
              onClick={verifyGST}
              disabled={isVerifying || isGSTVerified}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                isGSTVerified
                  ? "bg-green-500"
                  : isVerifying
                  ? "bg-gray-400"
                  : "bg-[#E42128] hover:bg-[#c91d22]"
              }`}
            >
              {isGSTVerified
                ? "Verified"
                : isVerifying
                ? "Verifying..."
                : "Verify"}
            </button>
          </div>

          {/* Other Fields */}
          <InputField
            icon={<Briefcase />}
            reg={register("company")}
            placeholder="Company Name *"
            disabled={autoFilledFields.includes("company")}
            error={errors.company}
            className="md:col-span-2"
          />

          <InputField
            icon={<User />}
            reg={register("fullName")}
            placeholder="First Name *"
            disabled={!isGSTVerified}
            error={errors.fullName}
          />

          <InputField
            icon={<User />}
            reg={register("lastName")}
            placeholder="Last Name *"
            disabled={!isGSTVerified}
            error={errors.lastName}
          />

          <InputField
            icon={<Mail />}
            reg={register("email")}
            placeholder="Email *"
            disabled={!isGSTVerified}
            error={errors.email}
          />

          <InputField
            icon={<Phone />}
            reg={register("phone")}
            placeholder="Mobile *"
            disabled={!isGSTVerified}
            error={errors.phone}
          />

          <InputField
            icon={<Briefcase />}
            reg={register("designation")}
            placeholder="Designation *"
            disabled={!isGSTVerified}
            error={errors.designation}
          />

          <InputField
            icon={<Home />}
            reg={register("address")}
            placeholder="Company Address *"
            disabled={autoFilledFields.includes("address")}
            error={errors.address}
          />

          <InputField
            icon={<Home />}
            reg={register("street")}
            placeholder="Street *"
            disabled={!isGSTVerified}
            error={errors.street}
          />

          <InputField
            icon={<Home />}
            reg={register("street2")}
            placeholder="Street 2 *"
            disabled={!isGSTVerified}
            error={errors.street2}
          />

          <InputField
            icon={<MapPin />}
            reg={register("city")}
            placeholder="City *"
            disabled={autoFilledFields.includes("city")}
            error={errors.city}
          />

          <InputField
            icon={<MapPin />}
            reg={register("pincode")}
            placeholder="Pincode *"
            disabled={!isGSTVerified}
            error={errors.pincode}
          />

          <InputField
            icon={<Globe />}
            reg={register("country")}
            placeholder="Country *"
            disabled={autoFilledFields.includes("country_id")}
            error={errors.country}
          />

          <InputField
            icon={<MapPin />}
            reg={register("state")}
            placeholder="State *"
            disabled={autoFilledFields.includes("state_id")}
            error={errors.state}
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

          <button
            type="submit"
            disabled={!isGSTVerified}
            className="md:col-span-2 w-full bg-[#E42128] hover:bg-[#c91d22] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Input Components
-------------------------------------------------- */
function InputField({
  icon,
  reg,
  placeholder,
  disabled,
  error,
  className,
}: any) {
  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute left-3 top-3 text-[#E42128]">{icon}</div>
      <input
        {...reg}
        placeholder={placeholder}
        disabled={disabled}
        className={`floating-input ${error ? "error" : ""} w-full`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

function PasswordField({ reg, placeholder, disabled, error }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-3 text-[#E42128]" />
      <input
        type={showPassword ? "text" : "password"}
        {...reg}
        placeholder={placeholder}
        disabled={disabled}
        className={`floating-input ${error ? "error" : ""} w-full pr-10`}
      />

      <div
        className="absolute right-3 top-3 cursor-pointer text-[#E42128]"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
