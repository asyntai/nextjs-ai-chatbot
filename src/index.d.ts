import type { ReactElement } from 'react';

export interface AsyntaiChatbotProps {
  /**
   * Your Asyntai widget ID, for example `asyntai_1a2b3c4d5e6f`. If you leave
   * it out, the component reads NEXT_PUBLIC_ASYNTAI_WIDGET_ID.
   */
  widgetId?: string;
  /** Set to false to keep the widget off the site during `next dev`. */
  enableInDevelopment?: boolean;
  /** Advanced. Load the widget script from another https URL. */
  scriptUrl?: string;
}

export declare function AsyntaiChatbot(props: AsyntaiChatbotProps): ReactElement | null;
export default AsyntaiChatbot;

export declare const DEFAULT_SCRIPT_URL: string;
export declare const ENV_NAME: 'NEXT_PUBLIC_ASYNTAI_WIDGET_ID';
