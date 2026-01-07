

/* ================= TYPES ================= */

import axiosInstance from "../api/axiosInstance";

export interface Product {
  product_id?: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Subscription {
  subscription_id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  order_date: string;
  next_invoice_date: string | false;
  recurring_plan_name: string;
  status: string | boolean;
  total_amount: number;
  currency: string;
  products: Product[];
}

export interface SendOtpPayload {
  type: "email" | "mobile";
  value: string;
}


export interface VerifyOtpPayload {
  type: "email" | "mobile";
  value: string;
  otp: string;
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

  return res.data?.data || [];
};





export const getUserContactsApi = async (): Promise<Subscription[]> => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const res = await axiosInstance.get("/api/getUserContacts", {
    params: {
      user_id: userId,
    },
  });

  return res.data || [];
};

export const sendOtp = async (payload: {
  user_id: number | string;
  type: "email" | "mobile";
  value: string;
}) => {
  const res = await axiosInstance.post("/api/send-otp", payload);
  return res.data;
};


export const verifyOtp = async (payload: {
  type: "email" | "mobile";
  value: string;
  otp: string;
}) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const res = await axiosInstance.post("/api/verify-otp", {
    user_id: userId,
    ...payload,
  });

  return res.data;
};


export const updateUserContact = async ({
  user_id,
  contact_id,
  payload,
}: {
  user_id: number | string;
  contact_id: number | string;
  payload: { email?: string; function?: string };
}) => {
  const res = await axiosInstance.put(
    `/api/updateUserContact`,
    payload,
    {
      params: {
        user_id,
        contact_id,
      },
    }
  );
  return res.data;
};