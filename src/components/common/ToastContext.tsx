/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

// --- Types ---
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds for better readability
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // --- Icon & Color Config ---
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          border: "border-green-500",
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          bg: "bg-white",
        };
      case "error":
        return {
          border: "border-[#E42128]", // Brand Red
          icon: <AlertCircle className="w-6 h-6 text-[#E42128]" />,
          bg: "bg-white",
        };
      case "warning":
        return {
          border: "border-yellow-500",
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          bg: "bg-white",
        };
      default: // info
        return {
          border: "border-blue-500",
          icon: <Info className="w-6 h-6 text-blue-500" />,
          bg: "bg-white",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container - Fixed Top Right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);

          return (
            <div
              key={toast.id}
              className={`
                flex items-center w-full max-w-sm p-4 rounded-lg shadow-2xl border-l-[6px] 
                transform transition-all duration-300 animate-in slide-in-from-right
                ${style.bg} ${style.border}
              `}
              role="alert"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mr-3">{style.icon}</div>

              {/* Message */}
              <div className="text-sm font-medium text-gray-800 flex-1">
                {toast.message}
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="ml-4 text-gray-400 hover:text-gray-900 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                onClick={() => removeToast(toast.id)}
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// /* eslint-disable react-refresh/only-export-components */
// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   type ReactNode,
// } from "react";

// // --- Types ---
// type ToastType = "success" | "error" | "info" | "warning";

// interface Toast {
//   id: number;
//   message: string;
//   type: ToastType;
// }

// interface ToastContextType {
//   showToast: (message: string, type?: ToastType) => void;
// }

// // --- Context ---
// const ToastContext = createContext<ToastContextType | undefined>(undefined);

// // --- Icons ---
// const Icons = {
//   success: (
//     <svg
//       className="w-6 h-6 text-green-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M5 13l4 4L19 7"
//       />
//     </svg>
//   ),
//   error: (
//     // Brand Color Red for Error Icon
//     <svg
//       className="w-6 h-6 text-[#E42128]"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   ),
//   info: (
//     <svg
//       className="w-6 h-6 text-blue-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     </svg>
//   ),
//   warning: (
//     <svg
//       className="w-6 h-6 text-yellow-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//       />
//     </svg>
//   ),
// };

// // --- Provider Component ---
// export const ToastProvider = ({ children }: { children: ReactNode }) => {
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const showToast = useCallback((message: string, type: ToastType = "info") => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);

//     // Auto remove after 3 seconds
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((toast) => toast.id !== id));
//     }, 3000);
//   }, []);

//   const removeToast = (id: number) => {
//     setToasts((prev) => prev.filter((toast) => toast.id !== id));
//   };

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}

//       {/* Toast Container - Fixed to Top Right */}
//       <div className="fixed top-20 right-5 z-[9999] flex flex-col space-y-3">
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             className={`
//               flex items-center w-full max-w-xs p-4 text-gray-500 bg-white
//               rounded-lg shadow-xl border-l-4 animate-slide-in-right
//               ${toast.type === "error" ? "border-[#E42128]" : ""}
//               ${toast.type === "success" ? "border-green-500" : ""}
//               ${toast.type === "info" ? "border-blue-500" : ""}
//               ${toast.type === "warning" ? "border-yellow-500" : ""}
//             `}
//             role="alert"
//           >
//             <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
//               {Icons[toast.type]}
//             </div>
//             <div className="ml-3 text-sm font-normal text-gray-800">
//               {toast.message}
//             </div>
//             <button
//               type="button"
//               className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
//               onClick={() => removeToast(toast.id)}
//             >
//               <span className="sr-only">Close</span>
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };

// // --- Custom Hook ---
// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error("useToast must be used within a ToastProvider");
//   }
//   return context;
// };
