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
