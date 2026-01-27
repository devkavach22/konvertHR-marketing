import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // Import your API instance
import { useToast } from "../common/ToastContext"; // Import Toast for notifications

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // State for download loading

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyId = () => {
    if (state?.paymentId) {
      navigator.clipboard.writeText(state.paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🟢 INTEGRATED DOWNLOAD FUNCTION
  const handleDownloadInvoice = async () => {
    console.log(state,"sssss");
    
    // Check if we have the invoice ID passed from the previous page
    if (!state?.invoiceId) {
      showToast(
        "Invoice ID is missing. Please check your email for the invoice.",
        "error"
      );
      return;
    }

    setIsDownloading(true);

    try {
      // 1. Call the API
      const response = await axiosInstance.post(
        "/api/invoice/download/",
        { invoice_id: state.invoiceId },
        {
          responseType: "blob", // 🔥 IMPORTANT: This tells axios to treat the response as a file
        }
      );

      // 2. Create a Blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // 3. Create a link element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // You can name the file here
      link.setAttribute("download", `Invoice_${state.invoiceId}.pdf`);

      // 4. Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("Invoice downloaded successfully!", "success");
    } catch (error) {
      console.error("Download failed:", error);
      showToast("Failed to download invoice. Please try again later.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] pt-20">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Session Expired
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-[#E42128] font-bold text-sm hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { plan, finalAmount, employees, paymentId } = state;

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-28 md:pt-32 pb-12 flex flex-col items-center justify-start p-4 relative overflow-hidden font-sans">
      {/* --- Ambient Background Mesh --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-red-100/50 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[100px]"></div>
      </div>

      {/* --- Landscape Ticket Container --- */}
      <div className="relative w-full max-w-5xl perspective-1000 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row overflow-hidden border border-white/50 relative">
          {/* ================= LEFT SECTION ================= */}
          <div className="w-full md:w-[60%] p-8 md:p-12 relative flex flex-col justify-between bg-white z-10">
            {/* Top Success Message */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-green-50 rounded-full animate-ping opacity-30"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-[#E42128] to-[#ff474e] rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-draw-check"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    Payment Confirmed
                  </h1>
                  <p className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    Successfully Paid
                  </p>
                </div>
              </div>

              <p className="text-gray-500 font-medium mb-8 max-w-md">
                Thank you! Your license for{" "}
                <span className="text-[#E42128] font-bold">{plan.name}</span>{" "}
                has been activated. A confirmation email has been sent to your
                registered address.
              </p>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 w-full">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                What happens next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Check your Email
                    </p>
                    <p className="text-xs text-gray-500">
                      We've sent your invoice and login credentials.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Complete Company Profile
                    </p>
                    <p className="text-xs text-gray-500">
                      Set up your dashboard to start adding employees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-4 rounded-xl text-sm font-bold text-white bg-[#E42128] shadow-lg shadow-red-200 hover:bg-[#c91d22] hover:shadow-red-300 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Go to Dashboard
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              {/* 🟢 DOWNLOAD INVOICE BUTTON */}
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex-1 sm:flex-none px-6 py-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Invoice
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= DIVIDER & RIGHT SECTION (Same as before) ================= */}
          <div className="relative hidden md:flex flex-col items-center justify-center w-8 bg-[#F3F4F6] self-stretch">
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2"></div>
            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F3F4F6] rounded-full shadow-inner z-20"></div>
            <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F3F4F6] rounded-full shadow-inner z-20"></div>
          </div>

          <div className="md:hidden w-full h-8 bg-[#F3F4F6] relative">
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F3F4F6] rounded-full"></div>
            <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F3F4F6] rounded-full"></div>
          </div>

          <div className="w-full md:w-[40%] bg-gray-50 p-8 md:p-12 flex flex-col justify-between border-l border-white/50 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Total Paid
                  </span>
                  <div className="text-4xl font-black text-gray-900 tracking-tight">
                    ₹{finalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                      Plan
                    </p>
                    <p className="font-bold text-gray-800">{plan.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                      Members
                    </p>
                    <p className="font-bold text-gray-800">{employees}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                      Date
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {currentDate.split(",")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                      Payment via
                    </p>
                    <p className="font-bold text-gray-800 text-sm">Razorpay</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                    Billed To
                  </p>
                  <p className="font-medium text-gray-800 text-sm">
                    Konvert HR User
                  </p>
                  <p className="text-xs text-gray-500">user@konverthr.com</p>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-200 border-dashed">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2">
                    Transaction ID
                  </p>
                  <div
                    onClick={handleCopyId}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2.5 cursor-pointer hover:border-[#E42128] transition-colors group"
                  >
                    <code className="text-xs font-mono text-gray-600 truncate mr-2">
                      {paymentId}
                    </code>
                    <div className="text-gray-400 group-hover:text-[#E42128]">
                      {copied ? (
                        <span className="text-xs font-bold text-green-600">
                          Copied
                        </span>
                      ) : (
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 relative z-10 opacity-60">
              <div className="h-10 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_128_bar_code_for_Wikipedia.svg/1200px-Code_128_bar_code_for_Wikipedia.svg.png')] bg-cover bg-center rounded-sm grayscale"></div>
              {/* <p className="text-[10px] text-center text-gray-400 font-mono mt-1 tracking-[0.3em]">
                {paymentId.substring(0, 12)}...
              </p> */}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 mt-6 opacity-60 text-xs font-medium text-gray-500">
          <span>Powered by Konvert HR</span>
          <span>Encrypted via Razorpay</span>
        </div>
      </div>

      <style>{`
        @keyframes draw-check {
          0% { stroke-dasharray: 0, 100; opacity: 0; }
          100% { stroke-dasharray: 100, 100; opacity: 1; }
        }
        .animate-draw-check {
          animation: draw-check 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
