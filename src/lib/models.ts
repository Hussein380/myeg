import mongoose, { Schema, Document, Model } from 'mongoose';

// --- SETTINGS MODEL ---
export interface ISettings extends Document {
  eggs: {
    crateCost: number;
    eggsPerCrate: number;
    unitCost: number;
    sellingPrice: number;
  };
  kienyejiEggs: {
    crateCost: number;
    eggsPerCrate: number;
    unitCost: number;
    sellingPrice: number;
  };
  smokies: {
    bagCost: number;
    quantityPerBag: number;
    unitCost: number;
    sellingPrice: number;
  };
  chapati: {
    bagCost: number;
    quantityPerBag: number;
    unitCost: number;
    sellingPrice: number;
  };
}

const SettingsSchema = new Schema<ISettings>({
  eggs: {
    crateCost: { type: Number, default: 450 },
    eggsPerCrate: { type: Number, default: 30 },
    unitCost: { type: Number, default: 15 },
    sellingPrice: { type: Number, default: 25 },
  },
  kienyejiEggs: {
    crateCost: { type: Number, default: 800 },
    eggsPerCrate: { type: Number, default: 30 },
    unitCost: { type: Number, default: 800 / 30 },
    sellingPrice: { type: Number, default: 40 },
  },
  smokies: {
    bagCost: { type: Number, default: 430 },
    quantityPerBag: { type: Number, default: 22 },
    unitCost: { type: Number, default: 430 / 22 },
    sellingPrice: { type: Number, default: 30 },
  },
  chapati: {
    bagCost: { type: Number, default: 100 },
    quantityPerBag: { type: Number, default: 10 },
    unitCost: { type: Number, default: 10 },
    sellingPrice: { type: Number, default: 20 },
  },
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

// --- EXPENSE MODEL ---
export interface IExpense extends Document {
  dailyRecordId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  dailyRecordId: { type: Schema.Types.ObjectId, ref: 'DailyRecord', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

// --- OWNER WITHDRAWAL MODEL ---
export interface IOwnerWithdrawal extends Document {
  date: Date;
  amount: number;
  reason: string;
  notes?: string;
  createdAt: Date;
}

const OwnerWithdrawalSchema = new Schema<IOwnerWithdrawal>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const OwnerWithdrawal = mongoose.models.OwnerWithdrawal || mongoose.model<IOwnerWithdrawal>('OwnerWithdrawal', OwnerWithdrawalSchema);

// --- DAILY RECORD MODEL ---
export interface IDailyRecord extends Document {
  date: Date;
  eggsSold: number;
  kienyejiEggsSold: number;
  smokiesSold: number;
  chapatisSold: number;
  cashCollected: number;
  tillCollected: number;
  
  // Snapshots
  eggSellingPriceUsed: number;
  eggUnitCostUsed: number;
  kienyejiSellingPriceUsed: number;
  kienyejiUnitCostUsed: number;
  smokieSellingPriceUsed: number;
  smokieUnitCostUsed: number;
  chapatiSellingPriceUsed: number;
  chapatiUnitCostUsed: number;
  
  // Calculated
  revenue: number;
  productCost: number;
  expenses: number;
  councilFees: number;
  grossProfit: number;
  netProfit: number;
  expectedMoney: number;
  actualMoney: number;
  difference: number;
  
  createdAt: Date;
  
  // Audit Trail
  editHistory: any[];
}

const DailyRecordSchema = new Schema<IDailyRecord>({
  date: { type: Date, required: true, unique: true },
  eggsSold: { type: Number, required: true },
  kienyejiEggsSold: { type: Number, default: 0 },
  smokiesSold: { type: Number, required: true },
  chapatisSold: { type: Number, required: true },
  cashCollected: { type: Number, required: true },
  tillCollected: { type: Number, required: true },
  
  eggSellingPriceUsed: { type: Number, required: true },
  eggUnitCostUsed: { type: Number, required: true },
  kienyejiSellingPriceUsed: { type: Number, default: 0 },
  kienyejiUnitCostUsed: { type: Number, default: 0 },
  smokieSellingPriceUsed: { type: Number, required: true },
  smokieUnitCostUsed: { type: Number, required: true },
  chapatiSellingPriceUsed: { type: Number, required: true },
  chapatiUnitCostUsed: { type: Number, required: true },
  
  revenue: { type: Number, required: true },
  productCost: { type: Number, required: true },
  expenses: { type: Number, required: true },
  councilFees: { type: Number, required: true },
  grossProfit: { type: Number, required: true },
  netProfit: { type: Number, required: true },
  expectedMoney: { type: Number, required: true },
  actualMoney: { type: Number, required: true },
  difference: { type: Number, required: true },
  
  createdAt: { type: Date, default: Date.now },
  
  editHistory: { type: Array, default: [] }
});

export const DailyRecord = mongoose.models.DailyRecord || mongoose.model<IDailyRecord>('DailyRecord', DailyRecordSchema);
