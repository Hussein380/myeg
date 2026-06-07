'use client';

import { useState } from 'react';
import { updateSettings } from '@/app/actions';

export default function SettingsForm({ settings }: { settings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateSettings(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Eggs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Eggs (Kawaida)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Crate Cost</label>
            <input type="number" name="eggCrateCost" defaultValue={settings.eggs.crateCost} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Eggs/Crate</label>
            <input type="number" name="eggsPerCrate" defaultValue={settings.eggs.eggsPerCrate} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
            <input type="number" step="0.01" name="eggUnitCost" defaultValue={settings.eggs.unitCost} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
            <input type="number" name="eggSellingPrice" defaultValue={settings.eggs.sellingPrice} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
        </div>
      </div>

      {/* Kienyeji Eggs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Kienyeji Eggs</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Crate Cost</label>
            <input type="number" name="kienyejiCrateCost" defaultValue={Number(settings.kienyejiEggs?.crateCost || 800)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Eggs/Crate</label>
            <input type="number" name="kienyejiPerCrate" defaultValue={settings.kienyejiEggs?.eggsPerCrate || 30} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
            <input type="number" step="0.01" name="kienyejiUnitCost" defaultValue={Number((settings.kienyejiEggs?.unitCost || (800/30)).toFixed(2))} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
            <input type="number" name="kienyejiSellingPrice" defaultValue={settings.kienyejiEggs?.sellingPrice || 40} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
        </div>
      </div>

      {/* Smokies */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Smokies</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bag Cost</label>
            <input type="number" name="smokieBagCost" defaultValue={Number(settings.smokies.bagCost.toFixed(2))} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Smokies/Bag</label>
            <input type="number" name="smokiesPerBag" defaultValue={settings.smokies.quantityPerBag} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
            <input type="number" step="0.01" name="smokieUnitCost" defaultValue={Number(settings.smokies.unitCost.toFixed(2))} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
            <input type="number" name="smokieSellingPrice" defaultValue={settings.smokies.sellingPrice} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
        </div>
      </div>

      {/* Chapati */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Chapati</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bag Cost</label>
            <input type="number" name="chapatiBagCost" defaultValue={settings.chapati.bagCost} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Chapatis/Bag</label>
            <input type="number" name="chapatisPerBag" defaultValue={settings.chapati.quantityPerBag} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
            <input type="number" step="0.01" name="chapatiUnitCost" defaultValue={settings.chapati.unitCost} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
            <input type="number" name="chapatiSellingPrice" defaultValue={settings.chapati.sellingPrice} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white" />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors disabled:opacity-70"
      >
        {isSubmitting ? 'SAVING...' : 'SAVE SETTINGS'}
      </button>
    </form>
  );
}
