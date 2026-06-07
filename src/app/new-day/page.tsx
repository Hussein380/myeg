"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDailyRecord } from "@/app/actions";

export default function NewDayPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenses, setExpenses] = useState<{ name: string; amount: number }[]>(
    [],
  );
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses([
        ...expenses,
        { name: expenseName, amount: Number(expenseAmount) },
      ]);
      setExpenseName("");
      setExpenseAmount("");
    }
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await submitDailyRecord(formData, expenses);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Day Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Section */}
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
            className="w-full text-lg p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 bg-white"
          />
        </div>

        {/* Sales Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Sales
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eggs Sold (Kawaida)</label>
            <input type="number" name="eggsSold" min="0" required placeholder="0" className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eggs Sold (Kienyeji)</label>
            <input type="number" name="kienyejiEggsSold" min="0" required placeholder="0" className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Smokies Sold
            </label>
            <input type="number"
              name="smokiesSold"
              min="0"
              required
              placeholder="0"
              className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapatis Sold
            </label>
            <input type="number"
              name="chapatisSold"
              min="0"
              required
              placeholder="0"
              className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Money Collected Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Money Collected
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cash Collected
            </label>
            <input type="number"
              name="cashCollected"
              min="0"
              required
              placeholder="0"
              className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Till/M-Pesa Collected
            </label>
            <input type="number"
              name="tillCollected"
              min="0"
              required
              placeholder="0"
              className="w-full text-xl p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Other Expenses
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="E.g. Charcoal"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
            />
            <input
              type="number"
              placeholder="Amt"
              min="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="w-24 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
            />
            <button
              type="button"
              onClick={handleAddExpense}
              className="bg-gray-800 text-white px-4 rounded-lg font-medium"
            >
              Add
            </button>
          </div>

          {expenses.length > 0 && (
            <ul className="space-y-2 mt-4">
              {expenses.map((exp, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                >
                  <span className="text-gray-700">{exp.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      {exp.amount}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExpense(index)}
                      className="text-red-500 text-sm font-bold"
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "SUBMIT DAY"}
        </button>
      </form>
    </div>
  );
}
