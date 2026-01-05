/* eslint-disable @typescript-eslint/no-explicit-any */
    import { useState } from "react";
import { getTestData } from "../api/userService";

export default function TestAPI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getTestData();
      setResult(data);
    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError(err?.response?.data || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#E42128]">
        🔍 Odoo API Token Test
      </h2>

      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-[#E42128] text-white px-5 py-2 rounded-lg hover:bg-[#c91d22] transition"
      >
        {loading ? "Testing..." : "Test Odoo API"}
      </button>

      <div className="mt-6 w-full max-w-xl bg-white shadow-md p-4 rounded-lg border border-gray-200">
        {error && (
          <p className="text-red-600 font-medium">
            ❌ Error: {JSON.stringify(error)}
          </p>
        )}

        {result && (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            ✅ Response:
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        {!error && !result && !loading && (
          <p className="text-gray-500 text-sm text-center">
            Click the button above to test the API connection.
          </p>
        )}
      </div>
    </div>
  );
}
