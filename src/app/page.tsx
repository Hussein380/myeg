import connectToDatabase from '@/lib/db';
import { DailyRecord, OwnerWithdrawal } from '@/lib/models';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

function StatCard({
  label,
  value,
  color = 'gray',
  prefix = 'KSh',
}: {
  label: string;
  value: number;
  color?: 'green' | 'red' | 'blue' | 'orange' | 'purple' | 'gray';
  prefix?: string;
}) {
  const colorMap = {
    green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  val: 'text-green-800' },
    red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    val: 'text-red-700' },
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-600',   val: 'text-blue-800' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', val: 'text-orange-800' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', val: 'text-purple-800' },
    gray:   { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-500',   val: 'text-gray-800' },
  };
  const c = colorMap[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-1`}>{label}</p>
      <p className={`text-xl font-black ${c.val}`}>
        {prefix} {Math.round(value).toLocaleString()}
      </p>
    </div>
  );
}

function SectionHeader({ emoji, title, subtitle, color }: { emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl px-4 py-3 flex items-center gap-3`}>
      <span className="text-2xl">{emoji}</span>
      <div>
        <h2 className="font-black text-white text-base leading-tight">{title}</h2>
        <p className="text-white/70 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  await connectToDatabase();

  const today = startOfDay(new Date());
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const [todayRecords, weekRecords, monthRecords, lifetimeRecords, allWithdrawals] = await Promise.all([
    DailyRecord.find({ date: today }),
    DailyRecord.find({ date: { $gte: weekStart, $lte: weekEnd } }),
    DailyRecord.find({ date: { $gte: monthStart, $lte: monthEnd } }),
    DailyRecord.find({}),
    OwnerWithdrawal.find({}),
  ]);

  const sum = (records: any[], key: string) => records.reduce((acc, r) => acc + (r[key] || 0), 0);

  // Today
  const todayRevenue   = sum(todayRecords, 'revenue');
  const todayProfit    = sum(todayRecords, 'netProfit');
  const todayExpenses  = sum(todayRecords, 'expenses');
  const todayDiff      = sum(todayRecords, 'difference');
  const todayMissing   = todayDiff < 0 ? Math.abs(todayDiff) : 0;
  const hasEntryToday  = todayRecords.length > 0;

  // Week
  const weekRevenue  = sum(weekRecords, 'revenue');
  const weekProfit   = sum(weekRecords, 'netProfit');
  const weekExpenses = sum(weekRecords, 'expenses');

  // Month
  const monthRevenue  = sum(monthRecords, 'revenue');
  const monthProfit   = sum(monthRecords, 'netProfit');
  const monthExpenses = sum(monthRecords, 'expenses');

  // Lifetime
  const lifetimeRevenue  = sum(lifetimeRecords, 'revenue');
  const lifetimeProfit   = sum(lifetimeRecords, 'netProfit');
  const lifetimeExpenses = sum(lifetimeRecords, 'expenses');
  const lifetimeDiff     = sum(lifetimeRecords, 'difference');
  const lifetimeMissing  = lifetimeDiff < 0 ? Math.abs(lifetimeDiff) : 0;
  const totalWithdrawals = sum(allWithdrawals, 'amount');
  const cashRemaining    = lifetimeProfit - totalWithdrawals;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-green-500 px-5 pt-10 pb-8">
        <p className="text-green-200 text-sm">{greeting} 👋</p>
        <h1 className="text-white text-2xl font-black mt-1">Mayai Business</h1>
        <p className="text-green-200 text-xs mt-1">{dateStr}</p>

        {/* Today quick summary in header */}
        <div className="mt-5 bg-white/15 rounded-2xl p-4 flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-white/70 text-[10px] uppercase font-bold">Today Revenue</p>
            <p className="text-white text-lg font-black">KSh {Math.round(todayRevenue).toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center flex-1">
            <p className="text-white/70 text-[10px] uppercase font-bold">Today Profit</p>
            <p className="text-white text-lg font-black">KSh {Math.round(todayProfit).toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center flex-1">
            <p className="text-white/70 text-[10px] uppercase font-bold">Status</p>
            {!hasEntryToday ? (
              <p className="text-yellow-300 text-xs font-bold mt-1">⚠️ No entry</p>
            ) : todayMissing > 0 ? (
              <p className="text-red-300 text-xs font-bold mt-1">🔴 Missing</p>
            ) : (
              <p className="text-green-200 text-xs font-bold mt-1">✅ Balanced</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 pb-28 max-w-md mx-auto">

        {/* Today */}
        <div className="space-y-3">
          <SectionHeader emoji="☀️" title="Today" subtitle="What happened today" color="bg-green-600" />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Revenue"   value={todayRevenue}  color="green" />
            <StatCard label="Profit"    value={todayProfit}   color={todayProfit >= 0 ? 'green' : 'red'} />
            <StatCard label="Expenses"  value={todayExpenses} color="orange" />
            <StatCard label="Missing 💸" value={todayMissing} color={todayMissing > 0 ? 'red' : 'green'} />
          </div>
        </div>

        {/* This Week */}
        <div className="space-y-3">
          <SectionHeader emoji="📅" title="This Week" subtitle="Monday to Sunday" color="bg-blue-600" />
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Revenue"  value={weekRevenue}  color="blue" />
            <StatCard label="Profit"   value={weekProfit}   color={weekProfit >= 0 ? 'green' : 'red'} />
            <StatCard label="Expenses" value={weekExpenses} color="orange" />
          </div>
        </div>

        {/* This Month */}
        <div className="space-y-3">
          <SectionHeader emoji="🗓️" title="This Month" subtitle={now.toLocaleString('en-KE', { month: 'long', year: 'numeric' })} color="bg-purple-600" />
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Revenue"  value={monthRevenue}  color="purple" />
            <StatCard label="Profit"   value={monthProfit}   color={monthProfit >= 0 ? 'green' : 'red'} />
            <StatCard label="Expenses" value={monthExpenses} color="orange" />
          </div>
        </div>

        {/* Lifetime */}
        <div className="space-y-3">
          <SectionHeader emoji="🏆" title="Lifetime" subtitle="Since day one" color="bg-gray-800" />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Revenue"  value={lifetimeRevenue}  color="green" />
            <StatCard label="Total Profit"   value={lifetimeProfit}   color={lifetimeProfit >= 0 ? 'green' : 'red'} />
            <StatCard label="Total Expenses" value={lifetimeExpenses} color="orange" />
            <StatCard label="Missing Money"  value={lifetimeMissing}  color={lifetimeMissing > 0 ? 'red' : 'green'} />
          </div>

          {/* Withdrawals & Cash */}
          <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">💼 Owner Withdrawals</p>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Total Withdrawn</span>
              <span className="text-orange-400 font-black">KSh {Math.round(totalWithdrawals).toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-semibold">Cash Remaining in Business</span>
              <span className={`font-black text-lg ${cashRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                KSh {Math.round(cashRemaining).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
