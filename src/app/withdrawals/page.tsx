"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addWithdrawal } from "@/app/actions";

export default function WithdrawalsPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await addWithdrawal(formData);
      if (res.success) {
        router.push("/");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Owner Withdrawal
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full text-lg p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input type="number"
              name="amount"
              min="1"
              required
              placeholder="0"
              className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input type="text"
              name="reason"
              required
              placeholder="E.g. Fuel, Lunch"
              className="w-full text-lg p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea name="notes"
              rows={3}
              className="w-full text-md p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "SAVE WITHDRAWAL"}
        </button>
      </form>
    </div>
  );
}
