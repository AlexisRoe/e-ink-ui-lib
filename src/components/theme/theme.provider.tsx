import { createContext, type ReactNode, useContext, useMemo } from "react";
import "./theme.css";

/**
 * Shape of the value exposed by {@link ThemeContext}.
 */
export interface ThemeContextValue {
  /** Whether the e-ink theme has been applied to the current subtree. */
  themeApplied: boolean;
  /**
   * Conditionally joins a base class name with a modifier class name.
   *
   * @param baseClassName - Class name that is always applied.
   * @param condition - When `true`, `activeClassName` is appended.
   * @param activeClassName - Class name applied only when `condition` is `true`.
   * @returns The resulting class name string, with any falsy parts removed.
   *
   * @example
   * ```tsx
   * const { cx } = useTheme();
   * <button className={cx("eink-button", isPressed, "eink-button--pressed")} />
   * ```
   */
  cx: (baseClassName: string, condition: boolean, activeClassName: string) => string;
}

/**
 * React context carrying the current e-ink theme state and helpers.
 *
 * Consumed via {@link useTheme}; not intended to be used directly.
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Props accepted by {@link ThemeProvider}.
 */
export interface ThemeProviderProps {
  /** The subtree that should receive the e-ink theme. */
  children: ReactNode;
}

/**
 * Joins a base class name with a conditional modifier class name.
 *
 * @param baseClassName - Class name that is always applied.
 * @param condition - When `true`, `activeClassName` is appended.
 * @param activeClassName - Class name applied only when `condition` is `true`.
 * @returns The resulting class name string, with any falsy parts removed.
 */
function cx(baseClassName: string, condition: boolean, activeClassName: string): string {
  return [baseClassName, condition ? activeClassName : null].filter(Boolean).join(" ");
}

/**
 * Root provider for the e-ink UI library's theme.
 *
 * Wrap the application (or any subtree) with `ThemeProvider` to load the
 * base e-ink stylesheet ({@link "./theme.css"}) and expose theme context to
 * descendant components via {@link useTheme}.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      themeApplied: true,
      cx,
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Reads the current e-ink theme context.
 *
 * Must be called from a component rendered inside {@link ThemeProvider}.
 *
 * @throws {Error} If called outside of a {@link ThemeProvider}.
 * @returns The current {@link ThemeContextValue}.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
