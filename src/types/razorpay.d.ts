export {};

declare global {
  interface Window {
    Razorpay: RazorpayInstance;
  }
}

interface RazorpayInstance {
  new (options: RazorpayOptions): RazorpayObject;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayObject {
  open(): void;
}

export interface Plan {
  modules: boolean;
  name: string;
  idealFor: string;
  price: string;
  fee: string;
}
