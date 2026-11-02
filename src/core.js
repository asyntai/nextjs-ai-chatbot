/**
 * Option handling for nextjs-ai-chatbot. It has no React or Next.js imports,
 * so the tests can run it in plain Node.
 */

export const DEFAULT_SCRIPT_URL = 'https://widget.asyntai.com/static/js/chat-widget.js';
export const ENV_NAME = 'NEXT_PUBLIC_ASYNTAI_WIDGET_ID';
export const SCRIPT_ID = 'asyntai-chatbot';

const WIDGET_ID_PATTERN = /^asyntai_[A-Za-z0-9]+$/;
const NAME = 'nextjs-ai-chatbot';

/**
 * Returns the settings to render, or an `error` string. It never throws: a
 * wrong widget ID must not take the customer's whole site down, so the
 * component renders nothing and explains why in the console instead.
 */
export function resolveOptions(options, env) {
  const opts = options || {};
  const vars = env || {};

  const fromProp = typeof opts.widgetId === 'string' ? opts.widgetId.trim() : '';
  const fromEnv = typeof vars[ENV_NAME] === 'string' ? vars[ENV_NAME].trim() : '';
  const widgetId = fromProp || fromEnv;

  if (!widgetId) {
    return {
      error:
        NAME +
        ': no widget ID. Pass widgetId="asyntai_..." or set ' +
        ENV_NAME +
        '. Copy the ID from the Install page of your Asyntai dashboard.',
    };
  }
  if (!WIDGET_ID_PATTERN.test(widgetId)) {
    return {
      error:
        NAME +
        ': "' +
        widgetId +
        '" does not look like a widget ID. It starts with asyntai_, for example asyntai_1a2b3c4d5e6f.',
    };
  }

  const scriptUrl =
    typeof opts.scriptUrl === 'string' && opts.scriptUrl.trim()
      ? opts.scriptUrl.trim()
      : DEFAULT_SCRIPT_URL;

  if (!/^https:\/\//.test(scriptUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(scriptUrl)) {
    return { error: NAME + ': scriptUrl must start with https://.' };
  }

  return {
    widgetId,
    scriptUrl,
    // Set to false to keep the widget off the site during `next dev`.
    enableInDevelopment: opts.enableInDevelopment !== false,
  };
}

/** True when the component should render nothing in this environment. */
export function isSkipped(settings, nodeEnv) {
  return nodeEnv === 'development' && settings.enableInDevelopment === false;
}
