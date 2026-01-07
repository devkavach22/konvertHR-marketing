import axiosInstance from "../api/axiosInstance";

/* ================= TYPES ================= */

export interface Product {
  product_id?: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Invoice {
 invoice_id: number;
  invoice_number: string | false;
  invoice_date: string | false;
  amount: number;
  state: string;
  download_url: string;
}

export interface Subscription {
  subscription_id: number;
  order_number: string;
  plan_name: string;
  status: string | boolean;
  next_invoice_date: string | false;
  total_amount: number;
  currency: string;
  invoices: Invoice[]; // ✅ ADD THIS
}

/* ================= API ================= */

export const getCustomerSubscriptions = async (): Promise<Subscription[]> => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const res = await axiosInstance.get("/api/getCustomerSubscriptions", {
    params: {
      user_id: userId,
    },
  });

  return res.data.data || [];
};



export const downloadInvoicePDF = async (invoiceId: number) => {
  const res = await axiosInstance.post(
    "/api/downloadInvoicePDF",
    { invoice_id: invoiceId },
    { responseType: "blob" }
  );

  // Create file download
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Invoice_${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
