'use client';

import { useState } from 'react';
import { updateSettings } from '@/app/actions';

function calcUnit(cost: number, qty: number): number {
  if (!cost || !qty) return 0;
  return cost / qty;
}

function ProductSection({
  title,
  costLabel,
  qtyLabel,
  costName,
  qtyName,
  sellingName,
  unitCostName,
  defaultCost,
  defaultQty,
  defaultSelling,
  optional = false,
}: {
  title: string;
  costLabel: string;
  qtyLabel: string;
  costName: string;
  qtyName: string;
  sellingName: string;
  unitCostName: string;
  defaultCost: number;
  defaultQty: number;
  defaultSelling: number;
  optional?: boolean;
}) {
  const [cost, setCost] = useState(defaultCost || 0);
  const [qty, setQty] = useState(defaultQty || 0);
  const unitCost = calcUnit(cost, qty);

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm space-y-4 ${optional ? 'border-2 border-dashed border-gray-300' : 'border border-gray-100'}`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {optional && <p className="text-xs text-gray-400 mt-0.5">Optional — fill in when you start selling</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cost */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{costLabel}</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 bg-white">
            <span className="pl-2 text-gray-400 text-xs">KSh</span>
            <input
              type="number"
              name={costName}
              value={cost || ''}
              onChange={(e) => setCost(Number(e.target.value))}
              placeholder="0"
              className="flex-1 p-2 text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Qty */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{qtyLabel}</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 bg-white">
            <input
              type="number"
              name={qtyName}
              value={qty || ''}
              onChange={(e) => setQty(Number(e.target.value))}
              placeholder="0"
              className="flex-1 p-2 text-gray-900 bg-transparent outline-none"
            />
            <span className="pr-2 text-gray-400 text-xs">pcs</span>
          </div>
        </div>

        {/* Auto Unit Cost — read only */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost <span className="text-green-600">(auto)</span></label>
          <div className="flex items-center border border-green-200 rounded-lg bg-green-50 px-3 py-2">
            <span className="text-gray-400 text-xs mr-1">KSh</span>
            <span className="font-bold text-green-700 text-sm">
              {unitCost > 0 ? unitCost.toFixed(2) : '—'}
            </span>
            {/* Hidden input so it's included in FormData */}
            <input type="hidden" name={unitCostName} value={unitCost} />
          </div>
          {cost > 0 && qty > 0 && (
            <p className="text-xs text-gray-400 mt-1">{cost} ÷ {qty} = {unitCost.toFixed(2)}</p>
          )}
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 bg-white">
            <span className="pl-2 text-gray-400 text-xs">KSh</span>
            <input
              type="number"
              name={sellingName}
              defaultValue={defaultSelling || ''}
              placeholder="0"
              className="flex-1 p-2 text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Margin hint */}
      {unitCost > 0 && defaultSelling > 0 && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
          💰 Margin per piece: <span className="font-semibold text-green-600">KSh {(defaultSelling - unitCost).toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateSettings(formData);
      alert('✅ Settings saved!');
    } catch {
      alert('❌ Error saving settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Starting Capital */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-white">💰 Starting Capital</h2>
          <p className="text-xs text-gray-400 mt-0.5">Money already in the business before using this app</p>
        </div>
        <div>
          <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 bg-gray-900">
            <span className="pl-3 text-gray-400 text-sm font-bold">KSh</span>
            <input
              type="number"
              step="0.01"
              name="initialCapital"
              defaultValue={settings.initialCapital || ''}
              placeholder="0"
              className="w-full p-3 text-white bg-transparent outline-none font-bold text-lg"
            />
          </div>
        </div>
      </div>

      <ProductSection
        title="🥚 Eggs (Kawaida)"
        costLabel="Crate Cost"
        qtyLabel="Eggs per Crate"
        costName="eggCrateCost"
        qtyName="eggsPerCrate"
        sellingName="eggSellingPrice"
        unitCostName="eggUnitCost"
        defaultCost={settings.eggs?.crateCost}
        defaultQty={settings.eggs?.eggsPerCrate}
        defaultSelling={settings.eggs?.sellingPrice}
      />

      <ProductSection
        title="🐔 Eggs (Kienyeji)"
        costLabel="Crate Cost"
        qtyLabel="Eggs per Crate"
        costName="kienyejiCrateCost"
        qtyName="kienyejiPerCrate"
        sellingName="kienyejiSellingPrice"
        unitCostName="kienyejiUnitCost"
        defaultCost={settings.kienyejiEggs?.crateCost}
        defaultQty={settings.kienyejiEggs?.eggsPerCrate}
        defaultSelling={settings.kienyejiEggs?.sellingPrice}
      />

      <ProductSection
        title="🌭 Chicken Smokies"
        costLabel="Bag Cost"
        qtyLabel="Smokies per Bag"
        costName="smokieBagCost"
        qtyName="smokiesPerBag"
        sellingName="smokieSellingPrice"
        unitCostName="smokieUnitCost"
        defaultCost={settings.smokies?.bagCost}
        defaultQty={settings.smokies?.quantityPerBag}
        defaultSelling={settings.smokies?.sellingPrice}
      />

      <ProductSection
        title="🥩 Beef Smokies"
        costLabel="Bag Cost"
        qtyLabel="Smokies per Bag"
        costName="beefSmokieBagCost"
        qtyName="beefSmokiesPerBag"
        sellingName="beefSmokieSellingPrice"
        unitCostName="beefSmokieUnitCost"
        defaultCost={settings.beefSmokies?.bagCost}
        defaultQty={settings.beefSmokies?.quantityPerBag}
        defaultSelling={settings.beefSmokies?.sellingPrice}
        optional
      />

      <ProductSection
        title="🫓 Chapati"
        costLabel="Bag Cost"
        qtyLabel="Chapatis per Bag"
        costName="chapatiBagCost"
        qtyName="chapatisPerBag"
        sellingName="chapatiSellingPrice"
        unitCostName="chapatiUnitCost"
        defaultCost={settings.chapati?.bagCost}
        defaultQty={settings.chapati?.quantityPerBag}
        defaultSelling={settings.chapati?.sellingPrice}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all disabled:opacity-60"
      >
        {isSubmitting ? '⏳ Saving...' : '💾 SAVE SETTINGS'}
      </button>
    </form>
  );
}
