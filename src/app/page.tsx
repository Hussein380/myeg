import connectToDatabase from "@/lib/db";
import { DailyRecord, OwnerWithdrawal } from "@/lib/models";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
} from "date-fns";
import clsx from "clsx";

export const dynamic = "force-dynamic";

function Card({
  title,
  value,
  isMoney,
  isNegative,
}: {
  title: string;
  value: number;
  isMoney?: boolean;
  isNegative?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center",
        isNegative && "border-red-200 bg-red-50",
        isMoney && !isNegative && value > 0 && "border-green-200 bg-green-50",
      )}
    >
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </h3>
      <p
        className={clsx(
          "text-xl font-bold",
          isNegative
            ? "text-red-600"
            : isMoney && value > 0
              ? "text-green-600"
              : "text-gray-900",
        )}
      >
        {isMoney ? "KSh " : ""}
        {Math.round(value).toLocaleString()}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  await connectToDatabase();

  const today = startOfDay(new Date());

  // Aggregate data for various periods
  const todayRecords = await DailyRecord.find({ date: today });
  const weekRecords = await DailyRecord.find({
    date: {
      $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
      $lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
    },
  });
  const monthRecords = await DailyRecord.find({
    date: { $gte: startOfMonth(new Date()), $lte: endOfMonth(new Date()) },
  });
  const lifetimeRecords = await DailyRecord.find({});
  const lifetimeWithdrawals = await OwnerWithdrawal.find({});

  const sumKey = (records: any[], key: string) =>
    records.reduce((acc, curr) => acc + (curr[key] || 0), 0);

  const todayRevenue = sumKey(todayRecords, "revenue");
  const todayProfit = sumKey(todayRecords, "netProfit");
  const todayExpenses = sumKey(todayRecords, "expenses");
  const todayMissingMoney =
    sumKey(todayRecords, "difference") < 0
      ? Math.abs(sumKey(todayRecords, "difference"))
      : 0;

  const weekRevenue = sumKey(weekRecords, "revenue");
  const weekProfit = sumKey(weekRecords, "netProfit");

  const monthRevenue = sumKey(monthRecords, "revenue");
  const monthProfit = sumKey(monthRecords, "netProfit");

  const lifetimeRevenue = sumKey(lifetimeRecords, "revenue");
  const lifetimeProfit = sumKey(lifetimeRecords, "netProfit");
  const lifetimeExpenses = sumKey(lifetimeRecords, "expenses");

  const totalDifference = sumKey(lifetimeRecords, "difference");
  const lifetimeMissingMoney =
    totalDifference < 0 ? Math.abs(totalDifference) : 0;

  const totalWithdrawals = sumKey(lifetimeWithdrawals, "amount");
  const cashRemaining = lifetimeProfit - totalWithdrawals;

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 pl-1">Today</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card title="Revenue" value={todayRevenue} isMoney />
          <Card title="Profit" value={todayProfit} isMoney />
          <Card title="Expenses" value={todayExpenses} isMoney />
          <Card
            title="Missing Money"
            value={todayMissingMoney}
            isMoney
            isNegative={todayMissingMoney > 0}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 pl-1">
          This Week
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Card title="Revenue" value={weekRevenue} isMoney />
          <Card title="Profit" value={weekProfit} isMoney />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 pl-1">
          This Month
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Card title="Revenue" value={monthRevenue} isMoney />
          <Card title="Profit" value={monthProfit} isMoney />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 pl-1">
          Lifetime
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card title="Total Revenue" value={lifetimeRevenue} isMoney />
          <Card title="Total Profit" value={lifetimeProfit} isMoney />
          <Card title="Total Expenses" value={lifetimeExpenses} isMoney />
          <Card
            title="Total Missing"
            value={lifetimeMissingMoney}
            isMoney
            isNegative={lifetimeMissingMoney > 0}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card title="Owner Withdrawals" value={totalWithdrawals} isMoney />
          <Card title="Cash Remaining" value={cashRemaining} isMoney />
        </div>
      </section>
    </div>
  );
}
