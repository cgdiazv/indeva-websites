import { NextResponse } from 'next/server';
import { runAutomatedRenewalScan } from '@/app/actions/hostings';

export const dynamic = 'force-dynamic';

/**
 * Automated Cron Endpoint for hosting renewal reminders.
 * Can be triggered daily via Vercel Cron, GitHub Actions, or Google Cloud Scheduler.
 * URL: /api/cron/send-renewals
 */
export async function GET(request: Request) {
  // Optional security check if CRON_SECRET is configured
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runAutomatedRenewalScan();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST(request: Request) {
  return GET(request);
}
