This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Analytics

This site uses [Plausible](https://plausible.io/) for simple analytics.

In the Plausible dashboard:

- `Visitors` and `Pageviews` show how many people are visiting the site.
- `Top Pages` shows which pages they viewed.
- `Goals` or `Custom Events` will show an event named `Engagement Session`.

`Engagement Session` is sent when someone hides or closes the tab and includes:

- `active_seconds`: how many seconds the page was actively visible
- `active_bucket`: a grouped version of that time, such as `10_to_29s` or `1_to_2m`

This tracking is intentionally simple:

- page visits are tracked across the site
- active time only counts while the tab is visible
- time does not keep counting while the tab is in the background

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
