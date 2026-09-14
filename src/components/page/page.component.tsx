import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";

import "./page.component.css";

/**
 * Matches `page.component.css`'s mobile breakpoint. Below this width,
 * {@link Page.Nav} is forced closed since it would otherwise cover the
 * screen as soon as it renders.
 */
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(MOBILE_MEDIA_QUERY).matches;
}

/** Side the {@link Page.Nav} is placed on. Defaults to `"left"`. */
export type PageNavSide = "left" | "right";

/**
 * How {@link Page.Nav} renders while folded on desktop/tablet.
 * `"hidden"` (default) collapses it out of the grid entirely; `"rail"`
 * keeps a slim icon-only rail visible instead of hiding it completely.
 */
export type PageCollapsedMode = "hidden" | "rail";

interface PageContextValue {
  navSide: PageNavSide;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  collapsedMode: PageCollapsedMode;
  isMobile: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
}

const PageContext = createContext<PageContextValue | undefined>(undefined);

function usePageContext(component: string): PageContextValue {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error(`Page.${component} can only be used inside a Page`);
  }
  return context;
}

/** Props accepted by {@link Page}. */
export interface PageProps extends HTMLAttributes<HTMLDivElement> {
  /** Side the {@link Page.Nav} sits on, when present. Defaults to `"left"`. */
  navSide?: PageNavSide;
  /**
   * Whether {@link Page.Nav} is open. Controlled: when provided, `Page`
   * no longer manages the open state itself, and {@link Page.NavToggle}/
   * {@link Page.NavCloseButton} call `onNavOpenChange` instead of toggling
   * it directly. Use this to sync the nav's state with, for example, a
   * router.
   */
  navOpen?: boolean;
  /**
   * Controls whether {@link Page.Nav} starts open on desktop/tablet.
   * Uncontrolled: {@link Page.NavToggle} manages this internally after the
   * initial render. Ignored when `navOpen` is provided. Defaults to `true`.
   */
  defaultNavOpen?: boolean;
  /**
   * Called whenever {@link Page.Nav} would open or close: from
   * {@link Page.NavToggle}, {@link Page.NavCloseButton}, pressing Escape
   * while the mobile overlay is open, or the viewport crossing into the
   * mobile breakpoint while open. Required to actually change the nav's
   * state when `navOpen` is controlled.
   */
  onNavOpenChange?: (open: boolean) => void;
  /**
   * How {@link Page.Nav} renders while folded on desktop/tablet: `"hidden"`
   * (default) removes it from the grid, `"rail"` keeps a slim icon-only
   * rail visible. Has no effect on mobile, where the nav is always either
   * fully hidden or a full-screen overlay. Defaults to `"hidden"`.
   */
  collapsedMode?: PageCollapsedMode;
  /** {@link Page.Header}, {@link Page.Nav}, {@link Page.Body}, {@link Page.Footer}. */
  children: ReactNode;
}

/**
 * Full-page layout composite: a sticky {@link Page.Header}, an optional
 * {@link Page.Nav} (left or right), a scrollable {@link Page.Body}, and a
 * sticky {@link Page.Footer}. Laid out with CSS grid, and responsive across
 * desktop, tablet, and mobile breakpoints.
 *
 * On mobile, {@link Page.Nav} is hidden by default and, when opened via
 * {@link Page.NavToggle}, expands to cover the full screen: focus moves to
 * {@link Page.NavCloseButton}, Tab is trapped inside the nav, Escape and
 * the close button both dismiss it (returning focus to
 * {@link Page.NavToggle}), and the page behind it stops scrolling. On
 * desktop/tablet, {@link Page.NavToggle} folds the nav in and out of the
 * grid instead (or collapses it to an icon rail, with `collapsedMode="rail"`).
 *
 * @example
 * ```tsx
 * <Page navSide="left">
 *   <Page.Header>
 *     <Page.NavToggle />
 *     <Title>My App</Title>
 *   </Page.Header>
 *   <Page.Nav>
 *     <Navigation>
 *       <Navigation.Item target="/" label="Home" />
 *     </Navigation>
 *   </Page.Nav>
 *   <Page.Body>
 *     <Text>Page content</Text>
 *   </Page.Body>
 *   <Page.Footer>
 *     <Text>Footer content</Text>
 *   </Page.Footer>
 * </Page>
 * ```
 */
export function Page({
  className,
  navSide = "left",
  navOpen: controlledNavOpen,
  defaultNavOpen = true,
  onNavOpenChange,
  collapsedMode = "hidden",
  children,
  ...rest
}: PageProps) {
  const isControlled = controlledNavOpen !== undefined;
  const [uncontrolledNavOpen, setUncontrolledNavOpen] = useState(() =>
    isMobileViewport() ? false : defaultNavOpen,
  );
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  const rootRef = useRef<HTMLDivElement>(null);

  const navOpen = isControlled ? controlledNavOpen : uncontrolledNavOpen;

  const setNavOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setUncontrolledNavOpen(open);
      }
      onNavOpenChange?.(open);
    },
    [isControlled, onNavOpenChange],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: { matches: boolean }) => {
      setIsMobile(event.matches);
      if (event.matches) {
        setNavOpen(false);
      }
    };
    handleChange(mediaQueryList);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [setNavOpen]);

  return (
    <PageContext.Provider
      value={{ navSide, navOpen, setNavOpen, collapsedMode, isMobile, rootRef }}
    >
      <div
        ref={rootRef}
        data-eink-component="page"
        className={cx(
          `eink-page eink-page--nav-${navSide}`,
          ["eink-page--nav-open", navOpen],
          ["eink-page--nav-closed", !navOpen],
          ["eink-page--nav-rail", !navOpen && !isMobile && collapsedMode === "rail"],
          [className ?? "", !!className],
        )}
        {...rest}
      >
        {children}
      </div>
    </PageContext.Provider>
  );
}

/** Props accepted by {@link Page.Header}. */
export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Renders a 2px solid black line along the header's bottom edge. Defaults to `true`. */
  withBorder?: boolean;
  children?: ReactNode;
}

/** Sticky header, pinned to the top of the viewport while {@link Page.Body} scrolls. */
function PageHeader({ className, withBorder = true, children, ...rest }: PageHeaderProps) {
  return (
    <header
      className={cx(
        "eink-page__header",
        ["eink-page__header--border", withBorder],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      {children}
    </header>
  );
}

/** Props accepted by {@link Page.Footer}. */
export interface PageFooterProps extends HTMLAttributes<HTMLElement> {
  /** Renders a 2px solid black line along the footer's top edge. Defaults to `true`. */
  withBorder?: boolean;
  children?: ReactNode;
}

/** Sticky footer, pinned to the bottom of the viewport while {@link Page.Body} scrolls. */
function PageFooter({ className, withBorder = true, children, ...rest }: PageFooterProps) {
  return (
    <footer
      className={cx(
        "eink-page__footer",
        ["eink-page__footer--border", withBorder],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      {children}
    </footer>
  );
}

/** Props accepted by {@link Page.Body}. */
export interface PageBodyProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/** Independently scrollable main content area. */
function PageBody({ className, children, ...rest }: PageBodyProps) {
  return (
    <main className={cx("eink-page__body", [className ?? "", !!className])} {...rest}>
      {children}
    </main>
  );
}

/** Props accepted by {@link Page.Nav}. */
export interface PageNavProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Uses a plain white background instead of the default light grey. Defaults to `false`. */
  mono?: boolean;
  /** Accessible label. Defaults to `"Page navigation"`. */
  "aria-label"?: string;
  children?: ReactNode;
}

/**
 * Navigation bar placed on {@link PageProps.navSide}. Foldable via
 * {@link Page.NavToggle} on desktop/tablet (fully hidden, or collapsed to
 * an icon rail with `collapsedMode="rail"` on {@link Page}); hidden by
 * default on mobile, where opening it covers the full screen, traps focus,
 * locks background scroll, and closes on Escape or
 * {@link Page.NavCloseButton}.
 */
function PageNav({ className, mono = false, "aria-label": ariaLabel, ...rest }: PageNavProps) {
  const { navOpen, setNavOpen, isMobile, collapsedMode, rootRef } = usePageContext("Nav");
  const navRef = useRef<HTMLElement>(null);
  const isRailCollapsed = !navOpen && !isMobile && collapsedMode === "rail";

  useEffect(() => {
    if (!isMobile || !navOpen) {
      return;
    }

    const navEl = navRef.current;
    const rootEl = rootRef.current;
    if (!navEl || !rootEl) {
      return;
    }

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    navEl.querySelector<HTMLButtonElement>(".eink-page__nav-close")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setNavOpen(false);
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusable = Array.from(navEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      rootEl.querySelector<HTMLButtonElement>(".eink-page__nav-toggle")?.focus();
    };
  }, [isMobile, navOpen, setNavOpen, rootRef]);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel ?? "Page navigation"}
      hidden={!navOpen && !isRailCollapsed}
      className={cx(
        "eink-page__nav",
        ["eink-page__nav--mono", mono],
        ["eink-page__nav--open", navOpen],
        ["eink-page__nav--rail", isRailCollapsed],
        [className ?? "", !!className],
      )}
      {...rest}
    />
  );
}

/** Props accepted by {@link Page.NavToggle}. */
export interface PageNavToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible label. Defaults to `"Toggle navigation"`. */
  "aria-label"?: string;
}

/**
 * Header button that opens/closes {@link Page.Nav}. Meant to be placed
 * inside {@link Page.Header}. On mobile it opens the nav as a full-screen
 * overlay; on desktop/tablet it folds the nav in and out of the page grid.
 */
function PageNavToggle({ className, "aria-label": ariaLabel, ...rest }: PageNavToggleProps) {
  const { navOpen, setNavOpen } = usePageContext("NavToggle");

  return (
    <Button.IconNaked
      icon="menu"
      aria-label={ariaLabel ?? "Toggle navigation"}
      aria-expanded={navOpen}
      className={cx("eink-page__nav-toggle", [className ?? "", !!className])}
      onClick={() => setNavOpen(!navOpen)}
      {...rest}
    />
  );
}

/** Props accepted by {@link Page.NavCloseButton}. */
export interface PageNavCloseButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible label. Defaults to `"Close navigation"`. */
  "aria-label"?: string;
}

/**
 * Close button rendered inside {@link Page.Nav}, only relevant on mobile
 * where the nav covers the full screen once opened.
 */
function PageNavCloseButton({
  className,
  "aria-label": ariaLabel,
  ...rest
}: PageNavCloseButtonProps) {
  const { setNavOpen } = usePageContext("NavCloseButton");

  return (
    <Button.IconNaked
      icon="close"
      aria-label={ariaLabel ?? "Close navigation"}
      className={cx("eink-page__nav-close", [className ?? "", !!className])}
      onClick={() => setNavOpen(false)}
      {...rest}
    />
  );
}

Page.Header = PageHeader;
Page.Footer = PageFooter;
Page.Body = PageBody;
Page.Nav = PageNav;
Page.NavToggle = PageNavToggle;
Page.NavCloseButton = PageNavCloseButton;
