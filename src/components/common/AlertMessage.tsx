import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  autoClose?: number; // milliseconds
}

export default function AlertMessage({
  type = "info",
  message,
  autoClose = 3500,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setVisible(false), autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  if (!visible) return null;

  const styles = {
    success:
      "bg-gradient-to-r from-green-50/60 to-green-100/60 border-green-400 text-green-700 backdrop-blur-lg",
    error:
      "bg-gradient-to-r from-red-50/60 to-red-100/60 border-red-400 text-red-700 backdrop-blur-lg",
    warning:
      "bg-gradient-to-r from-yellow-50/60 to-yellow-100/60 border-yellow-400 text-yellow-700 backdrop-blur-lg",
    info: "bg-gradient-to-r from-blue-50/60 to-blue-100/60 border-blue-400 text-blue-700 backdrop-blur-lg",
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div
      className={`flex items-start justify-between w-full px-4 py-3 mt-4 rounded-xl shadow-md border-l-4 animate-fadeIn ${styles[type]}`}
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        {icons[type]}
        <span>{message}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-gray-500 hover:text-gray-700 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}
