export interface ExpenseRecord {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO or YYYY-MM-DD
  vendor?: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const EXPENSE_CATEGORIES = [
  'Software & Tools',
  'Hosting & Infrastructure',
  'Advertising & Marketing',
  'Contractors & Freelancers',
  'Office & Equipment',
  'Domains & Services',
  'Legal & Accounting',
  'Taxes & Licenses',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Zelle',
  'PayPal',
  'Cash',
  'Check',
  'Other',
] as const;

export type ExpensePaymentMethod = (typeof EXPENSE_PAYMENT_METHODS)[number];
