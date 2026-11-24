import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { EinkProvider } from "../components/provider/provider.component";

/**
 * Renders `ui` inside {@link EinkProvider} with `@testing-library/react`, so
 * components depending on theme, notifications or modals work in tests.
 *
 * @example
 * ```tsx
 * renderWithProviders(<MyScreen />);
 * ```
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: EinkProvider, ...options });
}
