'use server';

import connectToDatabase from '@/lib/db';
import { Settings, DailyRecord, Expense, OwnerWithdrawal } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { startOfDay } from 'date-fns';

export async function submitDailyRecord(formData: FormData, otherExpenses: { name: string; amount: number }[]) {
  await connectToDatabase();

  const dateStr = formData.get('date') as string;
  const date = startOfDay(new Date(dateStr));
  
  // Check if record for this date already exists
  const existingRecord = await DailyRecord.findOne({ date });
  if (existingRecord) {
    throw new Error('A record for this date already exists. Please edit the existing record instead.');
  }

  // Get Settings
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({}); // Create defaults
  }

  const eggsSold = Number(formData.get("eggsSold")) || 0;
  const kienyejiEggsSold = Number(formData.get("kienyejiEggsSold")) || 0;
  const smokiesSold = Number(formData.get("smokiesSold")) || 0;
  const chapatisSold = Number(formData.get("chapatisSold")) || 0;
  
  const cashCollected = Number(formData.get('cashCollected')) || 0;
  const tillCollected = Number(formData.get('tillCollected')) || 0;

  // Snapshots
  const eggSellingPriceUsed = settings.eggs.sellingPrice;
  const eggUnitCostUsed = settings.eggs.unitCost;
  const kienyejiSellingPriceUsed = settings.kienyejiEggs?.sellingPrice || 40;
  const kienyejiUnitCostUsed = settings.kienyejiEggs?.unitCost || (800/30);
  const smokieSellingPriceUsed = settings.smokies.sellingPrice;
  const smokieUnitCostUsed = settings.smokies.unitCost;
  const chapatiSellingPriceUsed = settings.chapati.sellingPrice;
  const chapatiUnitCostUsed = settings.chapati.unitCost;

  // Calculate Revenue
  const eggRevenue = eggsSold * eggSellingPriceUsed;
  const kienyejiRevenue = kienyejiEggsSold * kienyejiSellingPriceUsed;
  const smokieRevenue = smokiesSold * smokieSellingPriceUsed;
  const chapatiRevenue = chapatisSold * chapatiSellingPriceUsed;
  const revenue = eggRevenue + kienyejiRevenue + smokieRevenue + chapatiRevenue;

  // Calculate Product Cost
  const eggCost = eggsSold * eggUnitCostUsed;
  const kienyejiCost = kienyejiEggsSold * kienyejiUnitCostUsed;
  const smokieCost = smokiesSold * smokieUnitCostUsed;
  const chapatiCost = chapatisSold * chapatiUnitCostUsed;
  const productCost = eggCost + kienyejiCost + smokieCost + chapatiCost;

  // Automatic Council Fees
  let councilFees = 0;
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, 5 is Friday
  if (dayOfWeek === 1) { // Monday
    councilFees = 100;
  } else if (dayOfWeek === 5) { // Friday
    councilFees = 200; // Day and Night
  }

  // Other Expenses
  const sumOtherExpenses = otherExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = councilFees + sumOtherExpenses;

  const grossProfit = revenue - productCost;
  const netProfit = grossProfit - totalExpenses;
  
  const expectedMoney = revenue;
  const actualMoney = cashCollected + tillCollected;
  const difference = actualMoney - expectedMoney;

  // Create Daily Record Snapshot
  const newRecord = await DailyRecord.create({
    date,
    eggsSold,
    kienyejiEggsSold,
    smokiesSold,
    chapatisSold,
    cashCollected,
    tillCollected,
    eggSellingPriceUsed,
    eggUnitCostUsed,
    kienyejiSellingPriceUsed,
    kienyejiUnitCostUsed,
    smokieSellingPriceUsed,
    smokieUnitCostUsed,
    chapatiSellingPriceUsed,
    chapatiUnitCostUsed,
    revenue,
    productCost,
    expenses: totalExpenses, // Total expenses including council fees
    councilFees,
    grossProfit,
    netProfit,
    expectedMoney,
    actualMoney,
    difference,
  });

  // Create Expense Documents for other expenses
  if (otherExpenses.length > 0) {
    const expenseDocs = otherExpenses.map(exp => ({
      dailyRecordId: newRecord._id,
      name: exp.name,
      amount: exp.amount,
      createdAt: date
    }));
    await Expense.insertMany(expenseDocs);
  }

  revalidatePath('/');
  revalidatePath('/reports');
  
  return { success: true, message: 'Day submitted successfully', recordId: newRecord._id.toString() };
}

export async function addWithdrawal(formData: FormData) {
  await connectToDatabase();
  const dateStr = formData.get('date') as string;
  const amount = Number(formData.get('amount'));
  const reason = formData.get('reason') as string;
  const notes = formData.get('notes') as string;

  await OwnerWithdrawal.create({
    date: startOfDay(new Date(dateStr)),
    amount,
    reason,
    notes
  });

  revalidatePath('/');
  revalidatePath('/reports');
  revalidatePath('/withdrawals');
  
  return { success: true };
}

export async function updateSettings(formData: FormData) {
  await connectToDatabase();
  
  const updateData = {
    eggs: {
      crateCost: Number(formData.get("eggCrateCost")),
      eggsPerCrate: Number(formData.get("eggsPerCrate")),
      unitCost: Number(formData.get("eggUnitCost")),
      sellingPrice: Number(formData.get("eggSellingPrice")),
    },
    kienyejiEggs: {
      crateCost: Number(formData.get("kienyejiCrateCost")),
      eggsPerCrate: Number(formData.get("kienyejiPerCrate")),
      unitCost: Number(formData.get("kienyejiUnitCost")),
      sellingPrice: Number(formData.get("kienyejiSellingPrice")),
    },
    smokies: {
      bagCost: Number(formData.get('smokieBagCost')),
      quantityPerBag: Number(formData.get('smokiesPerBag')),
      unitCost: Number(formData.get('smokieUnitCost')),
      sellingPrice: Number(formData.get('smokieSellingPrice')),
    },
    chapati: {
      bagCost: Number(formData.get('chapatiBagCost')),
      quantityPerBag: Number(formData.get('chapatisPerBag')),
      unitCost: Number(formData.get('chapatiUnitCost')),
      sellingPrice: Number(formData.get('chapatiSellingPrice')),
    }
  };

  await Settings.findOneAndUpdate({}, updateData, { upsert: true, new: true });
  
  revalidatePath('/settings');
  return { success: true };
}

export async function deleteDailyRecord(formData: FormData) {
  await connectToDatabase();
  const id = formData.get('id') as string;
  if (!id) throw new Error('ID is required');

  await DailyRecord.findByIdAndDelete(id);
  await Expense.deleteMany({ dailyRecordId: id });

  revalidatePath('/');
  revalidatePath('/reports');
}

