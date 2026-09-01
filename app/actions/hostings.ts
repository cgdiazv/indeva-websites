'use server';

import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { salesData as historicalSales } from '@/data/sales';
import { type HostingAccount, calculateRenewalStatus } from '@/lib/hostingUtils';
import { createHostingRenewalCheckoutSession } from '@/lib/stripeRenewal';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Fetch all hosting accounts sorted by renewal date ascending (earliest renewals first)
 */
export async function getHostingAccounts(): Promise<HostingAccount[]> {
  try {
    const snapshot = await db.collection('hosting_accounts').orderBy('renewalDate', 'asc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as HostingAccount[];
  } catch (error) {
    console.error('Error fetching hosting accounts:', error);
    return [];
  }
}

/**
 * Create a new hosting account
 */
export async function createHostingAccount(formData: FormData) {
  try {
    const customerName = (formData.get('customerName') as string)?.trim();
    const customerEmail = (formData.get('customerEmail') as string)?.trim() || '';
    const customerPhone = (formData.get('customerPhone') as string)?.trim() || '';
    const domain = (formData.get('domain') as string)?.trim().toLowerCase() || '';
    const planName = (formData.get('planName') as string)?.trim() || 'Webhosting Annual Subscription';
    const amount = parseFloat(formData.get('amount') as string) || 86;
    const billingCycle = (formData.get('billingCycle') as any) || 'annual';
    const startDate = (formData.get('startDate') as string) || new Date().toISOString().split('T')[0];
    const renewalDate = (formData.get('renewalDate') as string);
    const notes = (formData.get('notes') as string)?.trim() || '';
    const autoRenew = formData.get('autoRenew') === 'true';

    if (!customerName || !domain || !renewalDate) {
      return { success: false, error: 'Customer name, domain, and renewal date are required.' };
    }

    const initialStatus = calculateRenewalStatus(renewalDate, 'active');

    const newAccount = {
      customerName,
      customerEmail,
      customerPhone,
      domain,
      planName,
      amount,
      billingCycle,
      startDate,
      renewalDate,
      status: initialStatus,
      notes,
      autoRenew,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('hosting_accounts').add(newAccount);
    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating hosting account:', error);
    return { success: false, error: error.message || 'Failed to create hosting account.' };
  }
}

/**
 * Update an existing hosting account
 */
export async function updateHostingAccount(id: string, formData: FormData) {
  try {
    const customerName = (formData.get('customerName') as string)?.trim();
    const customerEmail = (formData.get('customerEmail') as string)?.trim() || '';
    const customerPhone = (formData.get('customerPhone') as string)?.trim() || '';
    const domain = (formData.get('domain') as string)?.trim().toLowerCase() || '';
    const planName = (formData.get('planName') as string)?.trim() || 'Webhosting Annual Subscription';
    const amount = parseFloat(formData.get('amount') as string) || 86;
    const billingCycle = (formData.get('billingCycle') as any) || 'annual';
    const startDate = (formData.get('startDate') as string);
    const renewalDate = (formData.get('renewalDate') as string);
    const manualStatus = formData.get('status') as HostingAccount['status'];
    const notes = (formData.get('notes') as string)?.trim() || '';
    const autoRenew = formData.get('autoRenew') === 'true';

    if (!customerName || !domain || !renewalDate) {
      return { success: false, error: 'Customer name, domain, and renewal date are required.' };
    }

    const calculatedStatus = calculateRenewalStatus(renewalDate, manualStatus || 'active');

    const updateData: Partial<HostingAccount> = {
      customerName,
      customerEmail,
      customerPhone,
      domain,
      planName,
      amount,
      billingCycle,
      startDate,
      renewalDate,
      status: calculatedStatus,
      notes,
      autoRenew,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('hosting_accounts').doc(id).update(updateData);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating hosting account:', error);
    return { success: false, error: error.message || 'Failed to update hosting account.' };
  }
}

/**
 * Quick-renew a hosting account (advances renewal date by 1 year or cycle)
 */
export async function quickRenewHosting(id: string, yearsToAdd: number = 1) {
  try {
    const doc = await db.collection('hosting_accounts').doc(id).get();
    if (!doc.exists) {
      return { success: false, error: 'Hosting account not found.' };
    }

    const data = doc.data() as HostingAccount;
    const currentRenewal = new Date(data.renewalDate || new Date());
    
    // If overdue by more than a year, set to 1 year from now, else add yearsToAdd to existing renewal date
    const today = new Date();
    let nextRenewal = new Date(currentRenewal);
    nextRenewal.setFullYear(nextRenewal.getFullYear() + yearsToAdd);

    // If next renewal is still in the past, push it to 1 year from today
    if (nextRenewal < today) {
      nextRenewal = new Date(today);
      nextRenewal.setFullYear(today.getFullYear() + yearsToAdd);
    }

    const nextRenewalStr = nextRenewal.toISOString().split('T')[0];
    const newStatus = calculateRenewalStatus(nextRenewalStr, 'active');

    await db.collection('hosting_accounts').doc(id).update({
      renewalDate: nextRenewalStr,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/dashboard');
    return { success: true, nextRenewal: nextRenewalStr };
  } catch (error: any) {
    console.error('Error renewing hosting account:', error);
    return { success: false, error: error.message || 'Failed to renew hosting account.' };
  }
}

/**
 * Delete a hosting account
 */
export async function deleteHostingAccount(id: string) {
  try {
    await db.collection('hosting_accounts').doc(id).delete();
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting hosting account:', error);
    return { success: false, error: error.message || 'Failed to delete hosting account.' };
  }
}

/**
 * Import past hosting customers from sales history (helper tool)
 */
export async function seedHostingsFromHistoricalSales() {
  try {
    const existing = await db.collection('hosting_accounts').get();
    const existingDomains = new Set(existing.docs.map(d => d.data().domain?.toLowerCase()));

    // Filter sales with hosting products
    const hostingSales = historicalSales.filter(sale => 
      sale.customer && 
      sale.products && 
      sale.products.toLowerCase().includes('webhosting')
    );

    let addedCount = 0;
    const batch = db.batch();

    // Group by customer to find latest purchase
    const customerMap = new Map<string, typeof historicalSales[0]>();
    for (const sale of hostingSales) {
      if (!customerMap.has(sale.customer!) || new Date(sale.date) > new Date(customerMap.get(sale.customer!)!.date)) {
        customerMap.set(sale.customer!, sale);
      }
    }

    for (const [customer, sale] of customerMap.entries()) {
      const generatedDomain = customer.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      if (existingDomains.has(generatedDomain)) continue;

      const saleDate = new Date(sale.date);
      const renewalDate = new Date(saleDate);
      renewalDate.setFullYear(saleDate.getFullYear() + 1);
      const renewalDateStr = renewalDate.toISOString().split('T')[0];

      const docRef = db.collection('hosting_accounts').doc();
      batch.set(docRef, {
        customerName: customer,
        customerEmail: `${customer.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        customerPhone: '',
        domain: generatedDomain,
        planName: 'Webhosting Annual Subscription',
        amount: sale.net_sales || 86,
        billingCycle: 'annual',
        startDate: saleDate.toISOString().split('T')[0],
        renewalDate: renewalDateStr,
        status: calculateRenewalStatus(renewalDateStr, 'active'),
        notes: `Imported from Historical Order #${sale.order_number}`,
        autoRenew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      existingDomains.add(generatedDomain);
      addedCount++;
    }

    if (addedCount > 0) {
      await batch.commit();
    }

    revalidatePath('/dashboard');
    return { success: true, addedCount };
  } catch (error: any) {
    console.error('Error importing historical hostings:', error);
    return { success: false, error: error.message || 'Failed to import historical hostings.' };
  }
}

/**
 * Generate a dynamic Stripe Checkout payment link for a hosting account
 */
export async function generateRenewalPaymentLink(hostingId: string) {
  try {
    const doc = await db.collection('hosting_accounts').doc(hostingId).get();
    if (!doc.exists) {
      return { success: false, error: 'Hosting account not found.' };
    }

    const data = { id: doc.id, ...doc.data() } as HostingAccount;
    const sessionRes = await createHostingRenewalCheckoutSession(data);

    if (!sessionRes.success || !sessionRes.url) {
      return { success: false, error: sessionRes.error || 'Could not generate Stripe payment link.' };
    }

    // Cache the payment URL on the record
    await db.collection('hosting_accounts').doc(hostingId).update({
      stripePaymentUrl: sessionRes.url,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      url: sessionRes.url,
      amount: data.amount,
      customerName: data.customerName,
      domain: data.domain,
    };
  } catch (error: any) {
    console.error('Error generating renewal payment link:', error);
    return { success: false, error: error.message || 'Failed to generate payment link.' };
  }
}

/**
 * Send an automated / manual renewal reminder email with the dynamic Stripe Checkout link via Resend
 */
export async function sendRenewalReminderEmail(hostingId: string, customMessage?: string) {
  try {
    const doc = await db.collection('hosting_accounts').doc(hostingId).get();
    if (!doc.exists) {
      return { success: false, error: 'Hosting account not found.' };
    }

    const account = { id: doc.id, ...doc.data() } as HostingAccount;

    if (!account.customerEmail || !account.customerEmail.includes('@')) {
      return { success: false, error: `Customer has no valid email address configured (${account.customerEmail || 'empty'}). Please edit account and add an email.` };
    }

    // 1. Generate fresh Stripe Checkout link
    const sessionRes = await createHostingRenewalCheckoutSession(account);
    if (!sessionRes.success || !sessionRes.url) {
      return { success: false, error: sessionRes.error || 'Failed to create Stripe payment link for email.' };
    }

    const paymentUrl = sessionRes.url;
    const renewalDateFormatted = new Date(account.renewalDate + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 2. Dispatch Email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Indeva Websites <web@indevasa.com>',
      to: account.customerEmail,
      subject: `Upcoming Hosting Renewal for ${account.domain} - $${account.amount.toFixed(2)} USD`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hosting Renewal Notice</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 35px 40px 25px 40px; background: linear-gradient(135deg, #FA8F27 0%, #f97316 100%); text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Indeva Websites</h1>
                      <p style="margin: 6px 0 0 0; color: #ffedd5; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Hosting Subscription Renewal Notice</p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 35px 40px;">
                      <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; font-weight: 600;">
                        Hello ${account.customerName},
                      </p>
                      <p style="font-size: 14px; line-height: 22px; color: #4b5563; margin: 0 0 24px 0;">
                        This is a friendly reminder that your web hosting subscription for <strong>${account.domain}</strong> is scheduled for renewal on <strong>${renewalDateFormatted}</strong>.
                      </p>

                      ${customMessage ? `
                        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                          <p style="margin: 0; font-size: 13px; color: #9a3412; font-style: italic;">
                            "${customMessage}"
                          </p>
                        </div>
                      ` : ''}

                      <!-- Invoice Summary Table -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-collapse: collapse; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden;">
                        <tr style="background-color: #f8fafc;">
                          <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Service / Product</td>
                          <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; text-align: right; border-bottom: 1px solid #e2e8f0;">Amount</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">
                            <strong>${account.planName || 'Webhosting Annual Subscription'}</strong>
                            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Domain: ${account.domain}</div>
                          </td>
                          <td style="padding: 14px 16px; font-size: 15px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #f1f5f9;">
                            $${account.amount.toFixed(2)} USD
                          </td>
                        </tr>
                        <tr style="background-color: #f8fafc;">
                          <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; font-weight: 700;">Total Renewal Due</td>
                          <td style="padding: 12px 16px; font-size: 16px; color: #f97316; font-weight: 800; text-align: right;">
                            $${account.amount.toFixed(2)} USD
                          </td>
                        </tr>
                      </table>

                      <!-- Payment Button -->
                      <div style="text-align: center; margin: 32px 0 20px 0;">
                        <a href="${paymentUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #FA8F27 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35); letter-spacing: 0.2px;">
                          Pay & Renew Hosting ($${account.amount.toFixed(2)}) →
                        </a>
                      </div>

                      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0 0 24px 0;">
                        🔒 Secure 256-bit encrypted checkout powered by <strong>Stripe</strong>. Accepts Credit Card, Apple Pay, & Google Pay.
                      </p>

                      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;">

                      <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 20px;">
                        Once payment is completed, your hosting plan will automatically be renewed for another full cycle, and you will receive an official tax invoice/receipt immediately.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">
                        Questions? Simply reply directly to this email or reach us at <a href="mailto:web@indevasa.com" style="color: #f97316; text-decoration: none; font-weight: 600;">web@indevasa.com</a>.
                      </p>
                      <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                        © ${new Date().getFullYear()} Indeva Websites. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
      return { success: false, error: emailError.message || 'Failed to send email via Resend.' };
    }

    const sentAt = new Date().toISOString();

    // 3. Update Firestore with lastReminderSentAt & cached payment URL
    await db.collection('hosting_accounts').doc(hostingId).update({
      lastReminderSentAt: sentAt,
      stripePaymentUrl: paymentUrl,
      updatedAt: sentAt,
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      sentAt,
      paymentUrl,
      emailId: emailData?.id,
    };
  } catch (error: any) {
    console.error('Error sending renewal reminder email:', error);
    return { success: false, error: error.message || 'Failed to send renewal reminder email.' };
  }
}

/**
 * Automated Scanner that evaluates all hosting accounts and sends renewal reminder emails
 * to customers whose hosting is expiring in 30, 14, 7, <=3, or <=0 days (with anti-spam safeguards).
 */
export async function runAutomatedRenewalScan() {
  try {
    const snapshot = await db.collection('hosting_accounts').get();
    const accounts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as HostingAccount[];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let processedCount = 0;
    let sentCount = 0;
    const details: Array<{
      id: string;
      customerName: string;
      domain: string;
      email: string;
      daysRemaining: number;
      status: 'sent' | 'skipped' | 'error';
      message: string;
    }> = [];

    for (const account of accounts) {
      processedCount++;

      // Skip suspended/cancelled
      if (account.status === 'suspended' || account.status === 'cancelled') {
        details.push({
          id: account.id,
          customerName: account.customerName,
          domain: account.domain,
          email: account.customerEmail || '',
          daysRemaining: 0,
          status: 'skipped',
          message: `Account is ${account.status}`,
        });
        continue;
      }

      // Skip if no email
      if (!account.customerEmail || !account.customerEmail.includes('@')) {
        details.push({
          id: account.id,
          customerName: account.customerName,
          domain: account.domain,
          email: '',
          daysRemaining: 0,
          status: 'skipped',
          message: 'No valid customer email configured',
        });
        continue;
      }

      const renewalDate = new Date(account.renewalDate + 'T00:00:00');
      renewalDate.setHours(0, 0, 0, 0);
      const diffTime = renewalDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Trigger windows: 30 days, 14 days, 7 days, 3 days, 2 days, 1 day, 0 days (due today), or 1-7 days overdue
      const isEligibleWindow = 
        daysRemaining === 30 || 
        daysRemaining === 14 || 
        daysRemaining === 7 || 
        (daysRemaining <= 3 && daysRemaining >= -7);

      if (!isEligibleWindow) {
        details.push({
          id: account.id,
          customerName: account.customerName,
          domain: account.domain,
          email: account.customerEmail,
          daysRemaining,
          status: 'skipped',
          message: `Outside reminder window (${daysRemaining} days remaining)`,
        });
        continue;
      }

      // Anti-spam check: Skip if emailed within the last 48 hours
      if (account.lastReminderSentAt) {
        const lastSentDate = new Date(account.lastReminderSentAt);
        const hoursSinceLastSent = (new Date().getTime() - lastSentDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastSent < 48) {
          details.push({
            id: account.id,
            customerName: account.customerName,
            domain: account.domain,
            email: account.customerEmail,
            daysRemaining,
            status: 'skipped',
            message: `Reminder was already sent ${Math.round(hoursSinceLastSent)}h ago (anti-spam cooldown)`,
          });
          continue;
        }
      }

      // Send the reminder
      const sendRes = await sendRenewalReminderEmail(account.id);
      if (sendRes.success) {
        sentCount++;
        details.push({
          id: account.id,
          customerName: account.customerName,
          domain: account.domain,
          email: account.customerEmail,
          daysRemaining,
          status: 'sent',
          message: `Emailed successfully (Due in ${daysRemaining} days)`,
        });
      } else {
        details.push({
          id: account.id,
          customerName: account.customerName,
          domain: account.domain,
          email: account.customerEmail,
          daysRemaining,
          status: 'error',
          message: sendRes.error || 'Send failed',
        });
      }
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      processedCount,
      sentCount,
      details,
      executedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error during automated renewal scan:', error);
    return {
      success: false,
      error: error.message || 'Automated scan failed.',
      processedCount: 0,
      sentCount: 0,
      details: [],
    };
  }
}
