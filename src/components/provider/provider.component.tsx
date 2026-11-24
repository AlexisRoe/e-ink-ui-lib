import type { ReactNode } from "react";

import { ModalProvider } from "../modal/modal.provider";
import { NotificationProvider } from "../notification/notification.provider";
import { ThemeProvider } from "../theme/theme.provider";

/** Props accepted by {@link EinkProvider}. */
export interface EinkProviderProps {
  /** The application subtree. */
  children: ReactNode;
  /** How long notifications stay visible, in milliseconds. Defaults to `5000`. */
  notificationDuration?: number;
}

/**
 * Default notification duration of {@link EinkProvider}, in milliseconds.
 */
export const DEFAULT_NOTIFICATION_DURATION_MS = 5000;

/**
 * Combines {@link ThemeProvider}, {@link NotificationProvider} and
 * {@link ModalProvider} in the order every app needs them. Use it once at the
 * root instead of nesting the three providers by hand.
 *
 * @example
 * ```tsx
 * <EinkProvider notificationDuration={4000}>
 *   <App />
 * </EinkProvider>
 * ```
 */
export function EinkProvider({
  children,
  notificationDuration = DEFAULT_NOTIFICATION_DURATION_MS,
}: EinkProviderProps) {
  return (
    <ThemeProvider>
      <NotificationProvider duration={notificationDuration}>
        <ModalProvider>{children}</ModalProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
