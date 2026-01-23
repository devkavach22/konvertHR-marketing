import React, { useEffect, useState } from "react";
import {
  getCustomerSubscriptions,
  downloadInvoicePDF,
} from "../services/subscriptionService";
import type { Subscription } from "../services/subscriptionService";

const SubscriptionHistory: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await getCustomerSubscriptions();
        console.log(data,"ddd");
        
        setSubscriptions(data);
      } catch {
        setError("Failed to load subscription history");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  console.log(subscriptions,"subscriptions");
  

  const handleDownload = async (invoiceId: number) => {
    try {
      setDownloadingInvoiceId(invoiceId);
      await downloadInvoicePDF(invoiceId);
    } catch {
      alert("Failed to download invoice");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  /* =======================
     FAKE / DERIVED STATS
  ======================== */
  const totalSubscriptions = subscriptions.length;

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "3_progress"
  ).length;

  const totalPaid = subscriptions.reduce(
    (sum, s) => sum + Number(s.total_amount || 0),
    0
  );

  const lastInvoiceDate = subscriptions[0]?.order_date || "—";

  /* =======================
     LOADING / ERROR
  ======================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 text-sm">
        Loading subscription history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 my-16">
      <div className="max-w-6xl mx-auto">
        {/* =======================
            SUMMARY CARDS
        ======================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Subscriptions</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {totalSubscriptions}
            </h3>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">Active Plans</p>
            <h3 className="text-2xl font-bold text-green-600 mt-2">
              {activeSubscriptions}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Currently running</p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Amount Paid</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              ₹ {totalPaid.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Including all invoices</p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">Last Invoice</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {lastInvoiceDate}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Most recent order</p>
          </div>
        </div>

        {/* =======================
            SUBSCRIPTION TABLE
        ======================== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Subscription History
            </h2>
            <span className="text-xs text-gray-500">
              {subscriptions.length} records
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">Order Date</th>
                  <th className="px-6 py-3 text-left">Next Billing</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Invoice</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {subscriptions.map((sub) => {
                  const invoice = sub.invoices?.[0];

                  return (
                    <tr
                      key={sub.subscription_id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {sub.order_number}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {sub.plan_name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {sub.order_date || "-"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {sub.next_invoice_date || "-"}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {sub.currency} {sub.total_amount}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sub.status === "3_progress"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {sub.status === "3_progress" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {invoice ? (
                          <button
                            onClick={() => handleDownload(invoice.invoice_id)}
                            disabled={
                              downloadingInvoiceId === invoice.invoice_id
                            }
                            className={`inline-flex items-center gap-2 text-xs font-medium ${
                              downloadingInvoiceId === invoice.invoice_id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            {downloadingInvoiceId === invoice.invoice_id
                              ? "Downloading…"
                              : "📄 Download"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Not available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {subscriptions.length === 0 && (
            <div className="py-14 text-center text-gray-500 text-sm">
              No subscriptions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
