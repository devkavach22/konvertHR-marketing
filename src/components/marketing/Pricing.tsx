/* eslint-disable prefer-const */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../common/ToastContext";
import axiosInstance from "../../api/axiosInstance";

// 1. Define the Interface for the API Response Data
interface ApiProduct {
  id: number;
  name: string;
  type: string;
  list_price: number;
  default_code: boolean;
  description: string;
  ideal_for: string;
  fees: number;
  duration_periods_no: number;
  duration: string;
  is_highlight: boolean;
}

// 2. Define the Interface for the UI Plan
interface Plan {
  id: number;
  name: string;
  idealFor: string;
  modules: string[];
  price: string;
  fee: string;
  highlight: boolean;
  listPrice: number; // 👈 add this
}

export default function Pricing() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { showToast } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to decode HTML entities (e.g., &amp; -> &)
  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // --- UPDATED PARSING LOGIC START ---
  const parseModules = (description: string): string[] => {
    if (!description) return [];

    let cleanText = decodeHtml(description);

    // STRATEGY 1: Check for Newlines (Works for your Lite Plan)
    // If the string has newlines, we trust that formatting.
    if (cleanText.includes("\n")) {
      return cleanText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }


    console.log("planss",plans)
    // STRATEGY 2: Keyword Extraction (Works for your Enterprise Plan)
    // Since the Enterprise plan is one long string, we look for these specific phrases.
    const knownFeatures = [
      "All Pro features",
      "All Lite features",
      "Workforce Planning & Budgeting",
      "Multi-Company & Multi Currency",
      "PAN-India Compliance Tracker",
      "Role based Access Control",
      "Advanced BI Analytics",
      "360° Performance Analysis",
      "White-label Branding",
      "Recruitment & Onboarding",
      "Expense & Reimbursement Mgmt",
      "Performance Appraisal",
      "Workflow Automation",
      "Advanced Payroll",
      "Exit & FNF Process",
      "Statutory Compliance",
      "Payslips & ESS Portal",
    ];

    let foundModules: string[] = [];

    // Loop through known features and check if they exist in the blob of text
    knownFeatures.forEach((feature) => {
      // We check inclusive case-insensitive to be safe
      if (cleanText.toLowerCase().includes(feature.toLowerCase())) {
        foundModules.push(feature);
      }
    });

    // If we found keywords, return them.
    // Otherwise, return the whole text as one bullet point so it's not empty.
    return foundModules.length > 0 ? foundModules : [cleanText];
  };
  // --- UPDATED PARSING LOGIC END ---

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/api/Read/products");

        if (response.data.status === "success") {
          const apiData: ApiProduct[] = response.data.data;

          const formattedPlans: Plan[] = apiData.map((item) => ({
            id: item.id,
            name: item.name,
            idealFor: item.ideal_for,
            listPrice: item.list_price,
            price: `₹${item.list_price}`,
            fee: `₹${item.fees.toLocaleString()}`,
            highlight: item.is_highlight, // Or check item.name.includes("OneSuite") if you want to force highlight
            modules: parseModules(item.description),
          }));

          // Sort: Put Lite (lower price) first, then Enterprise
          setPlans(
            formattedPlans.sort((a, b) => {
              const priceA = Number(a.price.replace("₹", ""));
              const priceB = Number(b.price.replace("₹", ""));
              return priceA - priceB;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        showToast("Failed to load pricing plans", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [showToast]);

  const handleChoosePlan = (plan: Plan) => {
    if (!userId) {
      showToast(
        "⚠️ Please register or login before selecting a plan.",
        "error"
      );
      navigate("/register");
      return;
    }
    navigate("/checkout", { state: plan });
  };

  if (loading) {
    return (
      <section className="py-20 text-center">
        <div className="animate-pulse text-gray-500 font-medium">
          Loading Plans...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] text-center relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our <span className="text-[#E42128]">Pricing Plans</span>
        </h2>
        <div className="w-20 h-[3px] bg-[#E42128] mt-3 mx-auto rounded-full"></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-14 max-w-7xl mx-auto items-stretch justify-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl flex flex-col justify-between shadow-md hover:shadow-2xl border transition-all duration-500 ${
                plan.highlight
                  ? "border-[#E42128] scale-105 bg-gradient-to-b from-white via-[#FFF5F5] to-[#FFEAEA]"
                  : "border-gray-100 hover:-translate-y-2"
              }`}
            >
              <div className="p-10 flex flex-col flex-grow">
                {plan.highlight && (
                  <span className="absolute top-0 right-0 bg-[#E42128] text-white text-xs font-semibold px-4 py-1 rounded-bl-2xl rounded-tr-3xl">
                    Most Popular
                  </span>
                )}

                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 italic text-sm mb-6">
                  {plan.idealFor}
                </p>

                <div className="mb-8">
                  <p className="text-3xl font-bold text-[#E42128] mb-1">
                    {plan.price}
                  </p>
                  <p className="text-gray-500 text-sm">Per Employee / Month</p>
                  <p className="mt-3 text-gray-700 font-medium">
                    Implementation Fee:{" "}
                    <span className="text-[#E42128] font-semibold">
                      {plan.fee}
                    </span>
                  </p>
                </div>

                <ul className="text-gray-700 text-left space-y-3 mb-8 flex-grow">
                  {plan.modules.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm leading-snug"
                    >
                      <span className="text-[#E42128] text-lg">✔</span>
                      <span className="whitespace-pre-line">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-10 pt-0">
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? "bg-[#E42128] text-white hover:bg-[#c91d22]"
                      : "border border-[#E42128] text-[#E42128] hover:bg-[#E42128] hover:text-white"
                  }`}
                  onClick={() => handleChoosePlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuth";
// import { useToast } from "../common/ToastContext";

// export default function Pricing() {
//   const navigate = useNavigate();
//   const { userId } = useAuth();
//   const { showToast } = useToast();

//   interface Plan {
//     name: string;
//     idealFor: string;
//     modules: string[];
//     price: string;
//     fee: string;
//     highlight: boolean;
//   }

//   const plans = [
//     {
//       name: "Konvert HR Lite (Starter Plan)",
//       idealFor: "Startups & Small Businesses (≤50 employees)",
//       modules: [
//         "Employee Master Database",
//         "Attendance & Leave Mgmt.",
//         "Payroll Processing",
//         "Statutory Compliance (PF, ESIC, PT, TDS)",
//         "Payslips & ESS Portal",
//         "Basic Reports & Analytics",
//       ],
//       price: "₹35 – ₹60",
//       fee: "₹5,000 (One-time)",
//       highlight: false,
//     },
//     {
//       name: "Konvert HR Pro (Growth Plan)",
//       idealFor: "SMEs (50–300 employees)",
//       modules: [
//         "All Lite features",
//         "Recruitment & Onboarding",
//         "Expense & Reimbursement Mgmt.",
//         "Performance Appraisal (KRA/KPI)",
//         "Workflow Automation",
//         "Advanced Payroll",
//         "Exit & FNF Process",
//         "Tally/Zoho/QuickBooks Integration",
//       ],
//       price: "₹60 – ₹120",
//       fee: "₹15,000 – ₹25,000",
//       highlight: true,
//     },
//     {
//       name: "Konvert HR OneSuite (Enterprise Plan)",
//       idealFor: "Enterprises & Multi-location Companies (300+ employees)",
//       modules: [
//         "All Pro features",
//         "Workforce Planning & Budgeting",
//         "Multi-Company & Multi-Currency",
//         "PAN-India Compliance Tracker",
//         "Role-based Access Control",
//         "Advanced BI Analytics",
//         "360° Performance Analysis",
//         "White-label Branding",
//       ],
//       price: "₹120 – ₹250",
//       fee: "₹50,000+ (Custom)",
//       highlight: false,
//     },
//   ];

//   const handleChoosePlan = (plan: Plan) => {
//     if (!userId) {
//       // show a toast
//       showToast(
//         "⚠️ Please register or login before selecting a plan.",
//         "error"
//       );
//       navigate("/register");
//       return;
//     }
//     navigate("/checkout", { state: plan });
//   };

//   return (
//     <section className="py-20 bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] text-center relative overflow-hidden">
//       <div className="container mx-auto px-6 relative z-10">
//         {/* Section Header */}
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//           Our <span className="text-[#E42128]">Pricing Plans</span>
//         </h2>
//         <div className="w-20 h-[3px] bg-[#E42128] mt-3 mx-auto rounded-full"></div>
//         {/* <p className="text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
//               Choose the perfect plan that fits your organization’s size and growth
//               journey.
//             </p> */}

//         {/* Pricing Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mt-14 max-w-7xl mx-auto items-stretch">
//           {plans.map((plan, index) => (
//             <div
//               key={index}
//               className={`relative bg-white rounded-3xl flex flex-col justify-between shadow-md hover:shadow-2xl border transition-all duration-500 ${
//                 plan.highlight
//                   ? "border-[#E42128] scale-105 bg-gradient-to-b from-white via-[#FFF5F5] to-[#FFEAEA]"
//                   : "border-gray-100 hover:-translate-y-2"
//               }`}
//             >
//               <div className="p-10 flex flex-col flex-grow">
//                 {/* Badge */}
//                 {plan.highlight && (
//                   <span className="absolute top-0 right-0 bg-[#E42128] text-white text-xs font-semibold px-4 py-1 rounded-bl-2xl rounded-tr-3xl">
//                     Most Popular
//                   </span>
//                 )}

//                 {/* Header */}
//                 <h3 className="text-2xl font-semibold text-gray-900 mb-2">
//                   {plan.name}
//                 </h3>
//                 <p className="text-gray-600 italic text-sm mb-6">
//                   {plan.idealFor}
//                 </p>

//                 {/* Price Section */}
//                 <div className="mb-8">
//                   <p className="text-3xl font-bold text-[#E42128] mb-1">
//                     {plan.price}
//                   </p>
//                   <p className="text-gray-500 text-sm">Per Employee / Month</p>
//                   <p className="mt-3 text-gray-700 font-medium">
//                     Implementation Fee:{" "}
//                     <span className="text-[#E42128] font-semibold">
//                       {plan.fee}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Features */}
//                 <ul className="text-gray-700 text-left space-y-3 mb-8 flex-grow">
//                   {plan.modules.map((m, i) => (
//                     <li
//                       key={i}
//                       className="flex items-start gap-2 text-sm leading-snug"
//                     >
//                       <span className="text-[#E42128] text-lg">✔</span>
//                       <span>{m}</span>
//                     </li>
//                   ))}
//                 </ul>X
//               </div>

//               {/* Button */}
//               <div className="p-10 pt-0">
//                 <button
//                   className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     plan.highlight
//                       ? "bg-[#E42128] text-white hover:bg-[#c91d22]"
//                       : "border border-[#E42128] text-[#E42128] hover:bg-[#E42128] hover:text-white"
//                   }`}
//                   onClick={() => handleChoosePlan(plan)}
//                 >
//                   Choose Plan
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Decorative Blobs */}
//       <div className="absolute top-0 left-0 w-80 h-80 bg-[#E42128]/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E42128]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
//     </section>
//   );
// }
