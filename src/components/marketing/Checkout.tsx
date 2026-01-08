import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../common/ToastContext";
import axiosInstance from "../../api/axiosInstance";
import logo from "../../assets/img/konvertr hr-logo.png";

// --- Razorpay Interfaces ---
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name: string; email: string; contact: string };
  theme?: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

export default function Checkout() {
  const { state: plan } = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<number>(50);
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [creatingInvoice, setCreatingInvoice] = useState<boolean>(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Plan Selected
          </h2>
          <button
            onClick={() => navigate("/pricing")}
            className="text-[#E42128] hover:underline font-medium"
          >
            ← Return to Pricing
          </button>
        </div>
      </div>
    );
  }

  // --- Calculations ---
  const priceString = plan.price.replace(/[^\d.-]/g, "");
  const [minPrice, maxPrice] = priceString.includes("-")
    ? priceString.split("-").map((v: string) => parseFloat(v) || 0)
    : [parseFloat(priceString) || 0, parseFloat(priceString) || 0];

  const avgPrice = (minPrice + maxPrice) / 2 || 50;
  const baseAmount = avgPrice * employees; // per month
  const yearlyBase = baseAmount * 12;
  const discountedAmount = isAnnual ? yearlyBase * 0.9 : baseAmount;
  const gstAmount = discountedAmount * 0.18;
  const finalAmount = discountedAmount + gstAmount;

  // --- Payment Logic ---
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!userId) {
      showToast("Please log in to proceed with payment", "error");
      navigate("/login");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      showToast("Razorpay SDK failed to load.", "error");
      return;
    }

    const options: RazorpayOptions = {
      key: "rzp_test_RaMkf44DAZamrv", // Replace with env variable
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      name: "Konvert HR",
      description: `Subscription for ${plan.name}`,
      image: "/logo.svg",
      handler: async (response: RazorpayResponse) => {
        setCreatingInvoice(true);
        try {
          const paymentPayload = {
            user_id: Number(userId),
            product_id: Number(plan.id),
            transection_number: response.razorpay_payment_id,
            price_unit: Math.round(finalAmount),
            plan_id: isAnnual ? "Yearly" : "Monthly",
          };
          
          console.log("Payment Payload:", paymentPayload);

          // ✅ 1. Capture the API Response
          const apiResponse = await axiosInstance.post(
            "/api/create/subscription",
            paymentPayload
          );

          console.log("Payment API Response:", apiResponse.data);

          // ✅ 2. Extract invoice_id safely
          const invoiceId = apiResponse.data?.data?.invoice_id;

          showToast("Payment recorded successfully!", "success");

          // ✅ 3. Pass invoiceId in state
          navigate("/payment-success", {
            state: {
              plan,
              employees,
              finalAmount,
              gstAmount,
              discountedAmount,
              paymentId: response.razorpay_payment_id,
              invoiceId: invoiceId, // <--- Added here
            },
          });
        } catch (error) {
          console.error("Payment API Failed:", error);
          showToast("Payment successful, but server sync failed.", "error");

          // Fallback navigation (invoiceId will be undefined here, preventing download but allowing view)
          navigate("/payment-success", {
            state: {
              plan,
              employees,
              finalAmount,
              gstAmount,
              discountedAmount,
              paymentId: response.razorpay_payment_id,
              // invoiceId: undefined
            },
          });
        } finally {
          setCreatingInvoice(false);
        }
      },
      prefill: {
        name: "Konvert HR User",
        email: "user@konverthr.com",
        contact: "9876543210",
      },
      theme: { color: "#E42128" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-20 pt-24">
      {/* --- Progress Stepper --- */}
      <div className="max-w-4xl mx-auto mb-10 px-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center text-[#E42128]">
            <span className="flex items-center justify-center w-8 h-8 border-2 border-[#E42128] rounded-full font-bold bg-[#E42128] text-white">
              ✓
            </span>
            <span className="ml-2 font-semibold">Select Plan</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-[#E42128] w-full"></div>
          </div>
          <div className="flex items-center text-[#E42128]">
            <span className="flex items-center justify-center w-8 h-8 border-2 border-[#E42128] rounded-full font-bold bg-white">
              2
            </span>
            <span className="ml-2 font-semibold">Checkout</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center text-gray-400">
            <span className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full font-bold bg-white">
              3
            </span>
            <span className="ml-2">Done</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* --- Left Column: Plan Visual & Features --- */}
        <div className="space-y-6 animate-fade-in-up">
          {/* 3D Card Visual */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-[#E42128] blur-2xl opacity-20 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
            <div className="relative h-64 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-between border border-gray-700">
              {/* Abstract Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E42128] opacity-20 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-start z-10">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Konvert HR Premium
                  </span>
                </div>
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 brightness-0 invert opacity-80"
                />
              </div>

              <div className="z-10">
                <h2 className="text-3xl font-bold tracking-tight mb-1">
                  {plan.name}
                </h2>
                <p className="text-gray-400 text-sm">{plan.idealFor}</p>
              </div>

              <div className="flex justify-between items-end z-10">
                <div className="text-gray-400 text-xs">
                  VALID FOR
                  <br />
                  <span className="text-white font-mono text-sm">
                    {isAnnual ? "12 MONTHS" : "1 MONTH"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{avgPrice}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Per User / Month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 font-bold mb-4">
              Included in your plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.modules?.map((mod: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center text-sm text-gray-600"
                >
                  <div className="w-5 h-5 rounded-full bg-red-50 text-[#E42128] flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {mod}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Right Column: Interactive Billing Engine --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-fit sticky top-24">
          <div className="p-8 space-y-8 flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Configure License
              </h3>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Step 2 of 3
              </div>
            </div>

            {/* Slider Section */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-sm font-medium text-gray-600">
                  How many employees?
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 focus-within:ring-2 focus-within:ring-[#E42128] focus-within:border-transparent transition-all">
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) =>
                      setEmployees(Math.max(1, parseInt(e.target.value) || 0))
                    }
                    className="w-16 text-right font-bold text-gray-900 focus:outline-none"
                  />
                  <span className="text-gray-400 text-sm ml-2">Users</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="200"
                value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E42128]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 User</span>
                <span>100+ Users</span>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="bg-[#FFF5F5] rounded-xl p-1 flex relative">
              <button
                onClick={() => setIsAnnual(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${
                  !isAnnual
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${
                  isAnnual
                    ? "bg-white text-[#E42128] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Yearly
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                  SAVE 10%
                </span>
              </button>
            </div>

            {/* Summary Lines */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({employees} users × {isAnnual ? "12 months" : "1 month"})</span>
                <span>
                  ₹
                  {(isAnnual ? baseAmount * 12 : baseAmount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {isAnnual && (
                <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Annual Discount (10%)
                  </span>
                  <span className="font-bold">
                    - ₹
                    {(baseAmount * 12 * 0.1).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (18%)</span>
                <span>
                  ₹
                  {gstAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer / Pay Section */}
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wide">
                  Total Amount Due
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{finalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={creatingInvoice}
              className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 ${
                creatingInvoice
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#E42128] to-[#ff474e] hover:shadow-red-200"
              }`}
            >
              {creatingInvoice ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment{" "}
                  <span className="text-2xl leading-none">→</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {creatingInvoice && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-[#E42128] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <h2 className="mt-8 text-xl font-bold text-gray-900">
            Confirming Payment
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we generate your invoice...
          </p>
        </div>
      )}
    </div>
  );
}

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";

// interface RazorpayResponse {
//   razorpay_payment_id: string;
//   razorpay_order_id?: string;
//   razorpay_signature?: string;
// }

// declare global {
//   interface Window {
//     Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
//   }
// }

// interface RazorpayOptions {
//   key: string;
//   amount: number;
//   currency: string;
//   name: string;
//   description: string;
//   image?: string;
//   handler: (response: RazorpayResponse) => void;
//   prefill?: { name: string; email: string; contact: string };
//   theme?: { color: string };
// }

// interface RazorpayInstance {
//   open: () => void;
// }

// export default function Checkout() {
//   const { state: plan } = useLocation();
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState<number>(50);
//   const [isAnnual, setIsAnnual] = useState<boolean>(false);

//   if (!plan) {
//     return (
//       <div className="text-center py-20 text-gray-600">
//         No plan selected. Please go back to pricing.
//       </div>
//     );
//   }

//   const [minPrice, maxPrice] = plan.price
//     .replace("₹", "")
//     .split("–")
//     .map((v: string) => parseFloat(v.trim()) || 0);

//   const avgPrice = (minPrice + maxPrice) / 2 || 50;
//   const baseAmount = avgPrice * employees;
//   const discountedAmount = isAnnual ? baseAmount * 0.9 : baseAmount;
//   const gstAmount = discountedAmount * 0.18;
//   const finalAmount = discountedAmount + gstAmount;

//   const loadRazorpayScript = () => {
//     return new Promise<boolean>((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     const res = await loadRazorpayScript();
//     if (!res) {
//       alert("Razorpay SDK failed to load.");
//       return;
//     }

//     const options: RazorpayOptions = {
//       key: "rzp_test_RaMkf44DAZamrv",
//       amount: Math.round(finalAmount * 100),
//       currency: "INR",
//       name: "Konvert HR",
//       description: plan.name,
//       image: "/logo.svg",
//       handler: (response: RazorpayResponse) => {
//         navigate("/payment-success", {
//           state: {
//             plan,
//             employees,
//             finalAmount,
//             gstAmount,
//             discountedAmount,
//             paymentId: response.razorpay_payment_id,
//           },
//         });
//       },
//       prefill: {
//         name: "Dhaval Ardi",
//         email: "dhaval@konverthr.com",
//         contact: "9876543210",
//       },
//       theme: { color: "#E42128" },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   return (
//     <section className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFEAEA] px-4 py-24">
//       <div className="relative bg-white/85 backdrop-blur-xl border border-[#E42128]/10 shadow-xl rounded-2xl p-8 max-w-4xl w-full overflow-hidden">
//         <div className="absolute top-4 right-4 bg-[#E42128] text-white text-xs px-3 py-1 rounded-full shadow-sm">
//           Konvert HR Checkout
//         </div>

//         <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-1">
//           {plan.name}
//         </h2>
//         <p className="text-center text-gray-500 text-sm mb-8">
//           {plan.idealFor}
//         </p>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* LEFT – PLAN FEATURES */}
//           <div className="bg-[#FFF8F8] border border-[#E42128]/10 rounded-xl p-5 shadow-inner">
//             <h3 className="text-lg font-semibold text-[#E42128] mb-3">
//               Included Modules
//             </h3>
//             {plan.modules && Array.isArray(plan.modules) ? (
//               <ul className="space-y-1.5 text-gray-700 text-sm">
//                 {plan.modules.map((module: string, idx: number) => (
//                   <li
//                     key={idx}
//                     className="flex items-start gap-2 border-b border-gray-100 pb-1.5"
//                   >
//                     <span className="text-[#E42128] text-base mt-[1px]">✔</span>
//                     {module}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500 text-sm">No features listed.</p>
//             )}
//           </div>

//           {/* RIGHT – BILLING */}
//           <div className="space-y-5">
//             <div className="border border-[#E42128]/10 rounded-xl p-5 bg-white/70 shadow-sm hover:shadow-md transition">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                 Billing Details
//               </h3>

//               <div className="flex items-center gap-3 mb-3">
//                 <label className="text-gray-700 font-medium text-sm">
//                   Employees:
//                 </label>
//                 <input
//                   type="number"
//                   value={employees}
//                   min={1}
//                   className="border border-gray-300 rounded-md px-3 py-1.5 w-24 text-center text-sm focus:ring-2 focus:ring-[#E42128] focus:outline-none"
//                   onChange={(e) => setEmployees(Number(e.target.value))}
//                 />
//               </div>

//               <label className="flex items-center gap-2 mb-4 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={isAnnual}
//                   onChange={(e) => setIsAnnual(e.target.checked)}
//                   className="w-4 h-4 accent-[#E42128]"
//                 />
//                 <span className="text-gray-700">
//                   Annual Billing (Save 10%)
//                 </span>
//               </label>

//               <div className="border-t pt-4 space-y-1 text-gray-800 text-sm">
//                 <p>Base Amount: ₹{baseAmount.toFixed(2)}</p>
//                 {isAnnual && (
//                   <p className="text-green-600">
//                     Discount (10%): -₹{(baseAmount * 0.1).toFixed(2)}
//                   </p>
//                 )}
//                 <p>GST (18%): ₹{gstAmount.toFixed(2)}</p>
//                 <p className="text-base font-semibold mt-2">
//                   Total Payable:{" "}
//                   <span className="text-[#E42128] font-bold text-lg">
//                     ₹{finalAmount.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={handlePayment}
//               className="w-full py-3.5 bg-[#E42128] text-white rounded-lg font-semibold text-sm hover:bg-[#c91d22] transition-all shadow-md hover:shadow-lg"
//             >
//               Pay Securely with Razorpay
//             </button>
//           </div>
//         </div>

//         {/* Decorative Blurs */}
//         <div className="absolute -top-16 -left-16 w-60 h-60 bg-[#E42128]/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#E42128]/10 rounded-full blur-3xl"></div>
//       </div>
//     </section>
//   );
// }
