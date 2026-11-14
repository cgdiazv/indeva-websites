This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Stripe hosting renewals

Hosting renewal checkout payments are recorded from the Checkout webhook; their
automatically generated invoices are not separate sales. Newly created checkout
invoices carry a renewal marker. Older links can be matched when Stripe exposes
the invoice's payment intent and its associated Checkout session. Stripe sales
and hosting renewal dates are recorded atomically so
webhook retries do not duplicate a sale or advance a renewal twice. Stripe lookup
or database errors cause a webhook failure so Stripe can retry.

Existing duplicate sales are not removed automatically. Verify the Stripe
payment references before deleting any historical duplicate from the dashboard.

Run the webhook regression tests with `node --test tests\stripe-webhooks.test.mjs`.
Renewal checkout links return clients to the thank-you page, which verifies the
Checkout session before confirming payment; audit submissions retain their own
confirmation message. Run the page tests with `node --test tests\thank-you.test.mjs`.

## Rocket Money expense import

After signing in, choose **Import Rocket Money CSV** on the dashboard's Expenses
tab and select a Rocket Money transaction export.
Only Business-category rows with valid dates and positive amounts are eligible.
The review lists excluded or invalid rows and compares against all dashboard
expenses, regardless of the current date filter.

No rows are selected by default. Review possible date-and-amount matches,
repeated CSV amounts, withdrawals, transfers, and ignored transactions before
selecting entries. Set dashboard categories individually or in bulk; the default
is Other. Select **Import** to save. Importing is atomic (up to 400 rows at a
time), and the dashboard is checked again for newly added matches before saving.
Import the same file again to process additional rows.

Rocket Money exports do not include stable transaction IDs. The importer keeps a
fingerprint to prevent reimporting the same row, but matching is approximate:
similar transactions can be distinct, and changing export details or exporting a
subset of identical rows can affect fingerprints. Verify ambiguous entries
manually. This is a manual CSV workflow, not an automatic Rocket Money sync.
CSV files are limited to 500 KB and 2,000 records. Run import tests with
`node --test tests\rocket-money-import.test.mjs`.

## Dashboard authentication

The dashboard requires a verified Firebase Authentication account with TOTP
multi-factor authentication and an explicitly authorized UID. Configure and
test the following **before deploying**; deploying without them prevents all
dashboard access. Existing sessions and the old shared password are invalid.

1. In the existing Firebase project, upgrade Authentication to Identity Platform,
   enable email/password sign-in and TOTP MFA, and create an administrator account
   with a strong unique password and verified email. MFA may incur provider costs.
2. Configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and
   `FIREBASE_PRIVATE_KEY` for the Admin SDK. Set `ADMIN_FIREBASE_UID` to the
   administrator's Firebase UID. Use the same Firebase project for all settings.
3. Configure `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
   and `NEXT_PUBLIC_FIREBASE_PROJECT_ID` using the Firebase web app settings.
   These public client settings must be present at build time as well as locally.
   Restrict authorized domains and API key usage according to Firebase guidance.
4. On a trusted machine, run `node scripts\enroll-admin-mfa.mjs` with those
   settings loaded. Enter the account email and password, add the displayed
   secret to an authenticator app, and verify its code. Never share the secret.
   Use Firebase's secure account-recovery procedures if the factor is lost.
   If the account already has phone MFA, use the login page instead: after
   entering the password, verify the existing phone factor using reCAPTCHA and
   SMS, then add the displayed secret to the authenticator app and confirm its
   code. This enrollment flow does not grant dashboard access using phone MFA;
   sign in again with TOTP afterward. The Firebase project must have both phone
   MFA and TOTP enabled, and its authorized domains and SMS region policy must
   allow the sign-in. See Firebase's
   [TOTP setup instructions](https://firebase.google.com/docs/auth/web/totp-mfa).
5. Test sign-in using email, password, and authenticator code before switching
   production traffic. The server requires the TOTP claim on every dashboard
   session; an account without MFA cannot access dashboard data or actions.
6. Configure `CRON_SECRET` in Vercel for scheduled renewals. The scheduled endpoint
   now rejects requests if it is missing; the dashboard's manual scan uses the
   admin session. Verify the cron still runs after deploying.

Firebase handles credential verification and provider-side abuse protections.
The application additionally limits verified session-cookie exchanges globally, but this
does not rate-limit direct calls to Firebase's public sign-in API. Configure
Firebase/Identity Platform and infrastructure abuse protection for production.
The Firebase session cookie lasts eight hours and is checked for revocation on
every protected operation. Signing out revokes all sessions for that account.
Run authentication tests with `node --test tests\admin-auth.test.mjs`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
