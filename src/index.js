/**
 * Asyntai AI chatbot for Next.js.
 *
 * Put <AsyntaiChatbot /> once in the root layout. It renders the ordinary
 * Asyntai embed through next/script, so it works in Server Components and in
 * the Pages Router, and the widget stays open while the visitor moves between
 * pages.
 */

// The full file name and the .default fallback are on purpose. With the Pages
// Router, Next.js runs this file in plain Node, which cannot resolve
// "next/script" without ".js" and returns the CommonJS exports object as the
// default import. The bundler (App Router) returns the component itself.
import NextScript from 'next/script.js';
import React from 'react';
import { resolveOptions, isSkipped, SCRIPT_ID, DEFAULT_SCRIPT_URL, ENV_NAME } from './core.js';

const Script = NextScript && NextScript.default ? NextScript.default : NextScript;

const warned = new Set();

function warnOnce(message) {
  if (process.env.NODE_ENV === 'production' || warned.has(message)) return;
  warned.add(message);
  console.error(message);
}

export function AsyntaiChatbot(props) {
  const settings = resolveOptions(props, {
    // Written out in full so Next.js can inline the value at build time.
    [ENV_NAME]: process.env.NEXT_PUBLIC_ASYNTAI_WIDGET_ID,
  });

  if (settings.error) {
    warnOnce(settings.error);
    return null;
  }
  if (isSkipped(settings, process.env.NODE_ENV)) return null;

  // lazyOnload waits for the page's load event, so the site always renders
  // first and a slow network never holds the page.
  return React.createElement(Script, {
    id: SCRIPT_ID,
    src: settings.scriptUrl,
    strategy: 'lazyOnload',
    'data-asyntai-id': settings.widgetId,
  });
}

export default AsyntaiChatbot;
export { DEFAULT_SCRIPT_URL, ENV_NAME };
