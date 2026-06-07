'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitDailyRecord } from '@/app/actions';

type Expense = { name: string; amount: number };

export default function NewDayPage() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [eggsSold, setEggsSold] = useState('');
  const [kienyejiEggsSold, setKienyejiEggsSold] = useState('');
  const [smokiesSold, setSmokiesSold] = useState('');
  const [beefSmokiesSold, setBeefSmokiesSold] = useState('');
  const [chapatisSold, setChapatisSold] = useState('');
  const [cashCollected, setCashCollected] = useState('');
  const [tillCollected, setTillCollected] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = () => {
    if (expenseName.trim() && expenseAmount) {
      setExpenses([...expenses, { name: expenseName.trim(), amount: Number(expenseAmount) }]);
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  const removeExpense = (index: number) => setExpenses(expenses.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await submitDailyRecord(formData, expenses);
      if (res.success) router.push('/');
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 px-4 pt-8 pb-6">
        <h1 className="text-white text-2xl font-bold">📋 End of Day Entry</h1>
        <p className="text-green-100 text-sm mt-1">Fill in today's sales and expenses</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5 max-w-md mx-auto pb-28">

        {/* Date */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">📅 Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full text-lg font-semibold p-3 border-2 border-gray-100 rounded-xl text-gray-900 bg-gray-50 focus:border-green-400 focus:bg-white outline-none transition"
          />
        </div>

        {/* EGGS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">🥚 Eggs Sold</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kawaida (Normal)</label>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-gray-400 text-sm font-medium">Qty</span>
                <input
                  type="number"
                  name="eggsSold"
                  value={eggsSold}
                  onChange={(e) => setEggsSold(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kienyeji</label>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-gray-400 text-sm font-medium">Qty</span>
                <input
                  type="number"
                  name="kienyejiEggsSold"
                  value={kienyejiEggsSold}
                  onChange={(e) => setKienyejiEggsSold(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SMOKIES */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">🌭 Smokies Sold</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chicken Smokie</label>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-gray-400 text-sm font-medium">Qty</span>
                <input
                  type="number"
                  name="smokiesSold"
                  value={smokiesSold}
                  onChange={(e) => setSmokiesSold(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Beef Smokie
                <span className="ml-2 text-xs font-normal text-gray-400">(optional — leave 0 if not selling yet)</span>
              </label>
              <div className="flex items-center border-2 border-dashed border-gray-200 rounded-xl overflow-hidden focus-within:border-green-400 focus-within:border-solid bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-gray-400 text-sm font-medium">Qty</span>
                <input
                  type="number"
                  name="beefSmokiesSold"
                  value={beefSmokiesSold}
                  onChange={(e) => setBeefSmokiesSold(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHAPATI */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">🫓 Chapati Sold</h2>
          <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
            <span className="px-3 text-gray-400 text-sm font-medium">Qty</span>
            <input
              type="number"
              name="chapatisSold"
              value={chapatisSold}
              onChange={(e) => setChapatisSold(e.target.value)}
              placeholder="0"
              min="0"
              required
              className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* MONEY COLLECTED */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">💰 Money Collected</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cash (Physical notes/coins)</label>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-green-600 font-bold text-sm">KSh</span>
                <input
                  type="number"
                  name="cashCollected"
                  value={cashCollected}
                  onChange={(e) => setCashCollected(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Till / M-Pesa</label>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 focus-within:bg-white transition">
                <span className="px-3 text-green-600 font-bold text-sm">KSh</span>
                <input
                  type="number"
                  name="tillCollected"
                  value={tillCollected}
                  onChange={(e) => setTillCollected(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  className="flex-1 py-3 pr-3 text-xl font-bold text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* OTHER EXPENSES */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">🧾 Other Expenses</h2>
          <p className="text-xs text-gray-400 mb-4">Charcoal, transport, water, packaging, etc. Kanjo is added automatically.</p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Charcoal"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="flex-1 p-3 border-2 border-gray-100 rounded-xl text-sm text-gray-900 bg-gray-50 focus:border-green-400 focus:bg-white outline-none transition"
            />
            <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-green-400 bg-gray-50 w-28 focus-within:bg-white transition">
              <span className="pl-2 text-gray-400 text-xs font-medium">KSh</span>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="flex-1 py-3 pl-1 pr-2 text-sm font-bold text-gray-900 bg-transparent outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddExpense}
              className="bg-green-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-green-700 transition"
            >
              + Add
            </button>
          </div>

          {expenses.length > 0 && (
            <ul className="space-y-2">
              {expenses.map((exp, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                  <span className="text-gray-700 text-sm">{exp.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">KSh {exp.amount}</span>
                    <button type="button" onClick={() => removeExpense(index)} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">×</button>
                  </div>
                </li>
              ))}
              <li className="flex justify-between items-center px-4 py-2 rounded-xl bg-orange-50 border border-orange-100">
                <span className="text-orange-700 text-sm font-semibold">Total Expenses</span>
                <span className="font-bold text-orange-700">KSh {expenses.reduce((a, e) => a + e.amount, 0)}</span>
              </li>
            </ul>
          )}

          {expenses.length === 0 && (
            <p className="text-center text-gray-300 text-sm py-4">No expenses added yet</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xl py-5 rounded-2xl shadow-lg transition-all disabled:opacity-60"
        >
          {isSubmitting ? '⏳ Saving...' : '✅ SUBMIT DAY'}
        </button>

      </form>
    </div>
  );
}
