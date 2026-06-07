import connectToDatabase from "@/lib/db";
import { Settings } from "@/lib/models";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await connectToDatabase();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      {/* Serialize settings object for client component */}
      <SettingsForm settings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
