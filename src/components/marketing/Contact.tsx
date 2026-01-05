/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AlertMessage from "../common/AlertMessage";

const schema = yup.object().shape({
  companyName: yup.string().required("Company name is required"),
  gstNumber: yup
    .string()
    .matches(
      /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/,
      "Invalid GST Format (Ex: 27AAACT2727Q1ZW)"
    )
    .required("GST number is required"),

  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter 10-digit mobile number")
    .required("Mobile number is required"),
  message: yup.string(),
});

export default function Contact() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // 👈 validate while typing
    reValidateMode: "onChange",
  });

  // 🎯 Submit Handler
  const onSubmit = async (formData: any) => {
    if (!captchaToken) {
      showAlert("warning", "⚠ Please verify the Captcha first!");
      return;
    }

    setLoading(true);
    setAlertInfo(null);

    const payload = {
      company_name: formData.companyName,
      email: formData.email,
      contact_name: formData.name,
      gst_number: formData.gstNumber,
      mobile_number: formData.mobile,
      subject: formData.message || "Contact Inquiry",
    };

    try {
      const res = await axiosInstance.post("/api/lead/create", payload);

      reset();
      if ((window as any).grecaptcha) window.grecaptcha.reset();
      setCaptchaToken(null);

      showAlert(
        "success",
        res?.data?.message || "🎉 Thanks! We will contact you soon."
      );
    } catch (error: any) {
      showAlert(
        "error",
        error?.response?.data?.message || "❌ Something went wrong. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🎉 Reusable toast function
  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 4000);
    document.getElementById("contact-alert")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFEAEA]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Let’s <span className="text-[#E42128]">Connect</span> & Grow Together
        </h2>

        {/* 🎉 Global Alert */}
        {alertInfo && (
          <div id="contact-alert" className="mb-6 w-full max-w-xl mx-auto">
            <AlertMessage type={alertInfo.type} message={alertInfo.message} />
          </div>
        )}

        <div className="bg-white/80 border border-[#E42128]/20 shadow-2xl rounded-2xl p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company & GST */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Company Name"
                register={register("companyName")}
                error={errors.companyName}
                placeholder="Enter company name"
              />
              <FormInput
                label="GST Number"
                register={register("gstNumber")}
                error={errors.gstNumber}
                placeholder="Enter GST number"
              />
            </div>

            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Your Name"
                register={register("name")}
                error={errors.name}
                placeholder="Enter your name"
              />
              <FormInput
                label="Email Address"
                register={register("email")}
                error={errors.email}
                placeholder="Enter your email"
                type="email"
              />
            </div>

            {/* Mobile Number */}
            <FormInput
              label="Mobile Number"
              register={register("mobile")}
              error={errors.mobile}
              placeholder="Enter 10-digit mobile number"
            />

            {/* Message */}
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register("message")}
                placeholder="Tell us how we can help..."
                rows={4}
                className="w-full border p-3 rounded-lg focus:border-[#E42128] outline-none"
              />
            </div>

            {/* Captcha */}
            <div className="text-left">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#E42128] text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#c81b21] hover:scale-[1.02]"
                }`}
            >
              {loading ? "Sending..." : "Send Message 🚀"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* 🧱 Small Reusable Input Component */
const FormInput = ({
  label,
  register,
  error,
  placeholder,
  type = "text",
}: any) => (
  <div className="text-left">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      {...register}
      placeholder={placeholder}
      className={`w-full border p-3 rounded-lg outline-none transition-all ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300 focus:border-[#E42128]"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);
