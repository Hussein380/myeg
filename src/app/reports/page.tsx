import connectToDatabase from "@/lib/db";
import { DailyRecord } from "@/lib/models";
import { format } from "date-fns";
import clsx from "clsx";
import { deleteDailyRecord } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await connectToDatabase();

  const records = await DailyRecord.find({}).sort({ date: -1 });

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Reports</h1>

      <div className="space-y-4">
        {records.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No records found.</p>
        ) : (
          records.map((record) => (
            <div
              key={record._id.toString()}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-gray-800">
                  {format(new Date(record.date), "EEE, MMM d, yyyy")}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "font-bold text-sm",
                      record.difference < 0 ? "text-red-600" : "text-green-600",
                    )}
                  >
                    {record.difference < 0 ? "MISSING: " : "DIFF: "}
                    {Math.abs(record.difference)}
                  </span>
                  <form action={deleteDailyRecord}>
                    <input type="hidden" name="id" value={record._id.toString()} />
                    <button type="submit" className="text-red-500 hover:text-red-700 text-xs font-semibold bg-red-50 px-2 py-1 rounded">Delete</button>
                  </form>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">
                  Revenue:{" "}
                  <span className="text-gray-900 font-semibold">
                    {Math.round(record.revenue)}
                  </span>
                </div>
                <div className="text-gray-600">
                  Profit:{" "}
                  <span className="text-gray-900 font-semibold">
                    {Math.round(record.netProfit)}
                  </span>
                </div>
                <div className="text-gray-600">
                  Expenses:{" "}
                  <span className="text-gray-900 font-semibold">
                    {Math.round(record.expenses)}
                  </span>
                </div>
                <div className="text-gray-600">
                  Kanjo:{" "}
                  <span className="text-gray-900 font-semibold">
                    {Math.round(record.councilFees)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
