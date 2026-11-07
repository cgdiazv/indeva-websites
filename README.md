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
