export interface HostingAccount {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  domain: string;
  planName: string;
  amount: number;
  billingCycle: 'annual' | 'monthly' | 'biannual';
  startDate: string;
  renewalDate: string;
  status: 'active' | 'pending_renewal' | 'overdue' | 'suspended' | 'cancelled';
  notes?: string;
  autoRenew?: boolean;
  lastReminderSentAt?: string;
  stripePaymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper to compute status dynamically based on renewal date if status is 'active' or 'pending_renewal'
 */
export function calculateRenewalStatus(
  renewalDateStr: string,
  currentStatus: HostingAccount['status'] = 'active'
): HostingAccount['status'] {
  if (currentStatus === 'suspended' || currentStatus === 'cancelled') {
    return currentStatus;
  }

  if (!renewalDateStr) return 'active';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renewalDate = new Date(renewalDateStr + (renewalDateStr.includes('T') ? '' : 'T00:00:00'));
  renewalDate.setHours(0, 0, 0, 0);

  const diffTime = renewalDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays <= 30) {
    return 'pending_renewal';
  }
  return 'active';
}
