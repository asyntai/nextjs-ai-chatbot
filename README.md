# nextjs-ai-chatbot

Add the [Asyntai](https://asyntai.com) AI chat assistant to your Next.js site,
including Fumadocs and Nextra docs. It answers visitor questions from your own
content, in more than 80 languages.

## Install

```bash
npm install nextjs-ai-chatbot
```

Then put the component at the end of the `<body>` in your root layout:

```tsx
// app/layout.tsx
import { AsyntaiChatbot } from 'nextjs-ai-chatbot';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AsyntaiChatbot widgetId="asyntai_1a2b3c4d5e6f" />
      </body>
    </html>
  );
}
```

Build the site. The chat bubble is on every page.

The component works in Server Components, so the layout needs no
`'use client'`. With the Pages Router, put it in `pages/_app.js`:

```jsx
import { AsyntaiChatbot } from 'nextjs-ai-chatbot';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <AsyntaiChatbot widgetId="asyntai_1a2b3c4d5e6f" />
    </>
  );
}
```

## Where the widget ID comes from

Open the Install page in your [Asyntai dashboard](https://asyntai.com/dashboard).
The widget ID is the value of `data-asyntai-id` in the snippet shown there. It
starts with `asyntai_`.

Creating an account is free, and the Free plan is enough to try the widget.

## Widget ID from an environment variable

Leave `widgetId` out and set this where you run `next build`:

```bash
NEXT_PUBLIC_ASYNTAI_WIDGET_ID=asyntai_1a2b3c4d5e6f
```

## Options

| Option | Type | Default | What it does |
| --- | --- | --- | --- |
| `widgetId` | string | `NEXT_PUBLIC_ASYNTAI_WIDGET_ID` | Your Asyntai widget ID |
| `enableInDevelopment` | boolean | `true` | Set to `false` to keep the widget off the site during `next dev` |
| `scriptUrl` | string | the Asyntai CDN | Advanced. Load the widget from another https URL |

If the widget ID is missing or malformed, the component renders nothing and
`next dev` prints a message that says how to fix it. Your site keeps working.

## What the component does

- It loads the Asyntai widget with `next/script`, after the page's `load`
  event, so your own content always renders first.
- Your JavaScript bundle stays the same size.
- The chat stays on screen while the visitor moves between pages, also on
  Fumadocs and other sites that change pages without a full reload.

## Fumadocs

Fumadocs is a Next.js app. Put the component in `app/layout.tsx` next to the
Fumadocs provider:

```tsx
import { RootProvider } from 'fumadocs-ui/provider/next';
import { AsyntaiChatbot } from 'nextjs-ai-chatbot';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <AsyntaiChatbot widgetId="asyntai_1a2b3c4d5e6f" />
      </body>
    </html>
  );
}
```

## Answering from your content

Asyntai reads your published pages. Add your site URL in the dashboard, and the
assistant answers from the same pages the widget sits on. You can also add extra
documents and question and answer pairs.

## Next.js versions

Next.js 13.4 and later, with React 18 or 19. Tested on Next.js 14 (App Router
and Pages Router) and Next.js 16 with Fumadocs 16.

## Removing it

Delete the `<AsyntaiChatbot />` line and build again. The widget is gone.

## Support

Email [hello@asyntai.com](mailto:hello@asyntai.com), or read the
[Next.js guide](https://asyntai.com/documentation/integrations/nextjs/).

## Licence

MIT. See [LICENSE](LICENSE).
