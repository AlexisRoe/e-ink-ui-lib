import type {
  ButtonHTMLAttributes,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
} from "react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";

import "./navigation.component.css";

/** Orientation of a {@link Navigation} list. */
export type NavigationOrientation = "vertical" | "horizontal";

interface NavigationContextValue {
  rootOrientation: NavigationOrientation;
  onSelect?: (target: string, index: number) => void;
}

const NavigationContext = createContext<NavigationContextValue>({ rootOrientation: "vertical" });

interface NavigationListContextValue {
  orientation: NavigationOrientation;
}

const NavigationListContext = createContext<NavigationListContextValue>({
  orientation: "vertical",
});

const KEY_MAP: Record<
  NavigationOrientation,
  { next: string; prev: string; open: string; close: string }
> = {
  vertical: { next: "ArrowDown", prev: "ArrowUp", open: "ArrowRight", close: "ArrowLeft" },
  horizontal: { next: "ArrowRight", prev: "ArrowLeft", open: "ArrowDown", close: "ArrowUp" },
};

const TRIGGER_SELECTOR = ":scope > li > .eink-navigation-item__trigger";

function focusItemAt(list: HTMLUListElement, index: number) {
  const items = Array.from(list.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR));
  if (items.length === 0) {
    return;
  }
  const clamped = (index + items.length) % items.length;
  items[clamped]?.focus();
}

function indexOfTrigger(list: HTMLUListElement, trigger: Element) {
  return Array.from(list.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR)).indexOf(
    trigger as HTMLButtonElement,
  );
}

/** Props accepted by {@link Navigation.Item}. */
export interface NavigationItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> {
  /** Item label. */
  label: ReactNode;
  /** Optional icon shown before the label. */
  icon?: IconName;
  /**
   * Destination this item represents, passed to `onSelect` when clicked.
   * Not required on items that open a submenu.
   */
  target?: string;
  /** Nested {@link Navigation.Item} elements. When present, this item opens a submenu instead of calling `onSelect`. */
  children?: ReactNode;
}

/** @internal Props injected by {@link NavigationListItems} into each rendered {@link Navigation.Item}. */
interface NavigationItemInternalProps {
  __navIndex?: number;
  __tabIndex?: 0 | -1;
  __onFocus?: () => void;
}

/**
 * Single entry of a {@link Navigation} list. Can only be used inside
 * {@link Navigation}, which reads its `target` to report clicks. When given
 * nested `Navigation.Item` elements as `children`, it opens a submenu
 * instead of calling `onSelect`.
 *
 * @example
 * ```tsx
 * <Navigation.Item target="/settings" icon="settings" label="Settings" />
 * <Navigation.Item label="Products">
 *   <Navigation.Item target="/products/new" label="New" />
 * </Navigation.Item>
 * ```
 */
function NavigationItem(props: NavigationItemProps & NavigationItemInternalProps) {
  const {
    className,
    label,
    icon,
    target,
    children,
    __navIndex = 0,
    __tabIndex = -1,
    __onFocus,
    ...rest
  } = props;

  const { onSelect, rootOrientation } = useContext(NavigationContext);
  const { orientation: listOrientation } = useContext(NavigationListContext);
  const isInlineSubmenu = rootOrientation === "vertical";
  const [isOpen, setIsOpen] = useState(false);

  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const subItems = Children.toArray(children).filter(isValidElement);
  const hasSubmenu = subItems.length > 0;
  const keys = KEY_MAP[listOrientation];

  const closeSubmenu = (refocus: boolean) => {
    setIsOpen(false);
    if (refocus) {
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    submenuRef.current?.querySelector<HTMLButtonElement>(".eink-navigation-item__trigger")?.focus();

    const handleOutsideClick = (event: MouseEvent) => {
      if (!itemRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleClick = () => {
    if (hasSubmenu) {
      setIsOpen((current) => !current);
      return;
    }
    if (target !== undefined) {
      onSelect?.(target, __navIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (hasSubmenu && !isOpen && event.key === keys.open) {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(true);
    } else if (hasSubmenu && isOpen && (event.key === keys.close || event.key === "Escape")) {
      event.preventDefault();
      event.stopPropagation();
      closeSubmenu(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (isOpen && !itemRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <li
      ref={itemRef}
      role="none"
      className={cx("eink-navigation-item", [className ?? "", !!className])}
      onBlur={handleBlur}
    >
      <button
        type="button"
        ref={triggerRef}
        role="menuitem"
        className={cx("eink-navigation-item__trigger", [
          "eink-navigation-item__trigger--open",
          isOpen,
        ])}
        tabIndex={__tabIndex}
        aria-haspopup={hasSubmenu ? "menu" : undefined}
        aria-expanded={hasSubmenu ? isOpen : undefined}
        onFocus={__onFocus}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {icon && (
          <Icon name={icon} className="eink-navigation-item__icon" aria-hidden="true" size={16} />
        )}
        <span className="eink-navigation-item__label">{label}</span>
        {hasSubmenu && (
          <Icon
            name={
              isInlineSubmenu
                ? isOpen
                  ? "chevron-up"
                  : "chevron-down"
                : listOrientation === "horizontal"
                  ? "chevron-down"
                  : "chevron-right"
            }
            className="eink-navigation-item__chevron"
            aria-hidden="true"
            size={16}
          />
        )}
      </button>
      {hasSubmenu && isOpen && (
        // biome-ignore lint/a11y/noStaticElementInteractions: positioning wrapper for the submenu's own Escape/close-key handling, not an interactive element itself.
        <div
          className={cx("eink-navigation-item__submenu", [
            "eink-navigation-item__submenu--inline",
            isInlineSubmenu,
          ])}
          ref={submenuRef}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === KEY_MAP.vertical.close) {
              event.preventDefault();
              event.stopPropagation();
              closeSubmenu(true);
            }
          }}
        >
          <NavigationListItems
            orientation="vertical"
            role="menu"
            className="eink-navigation-item__submenu-list"
          >
            {children}
          </NavigationListItems>
        </div>
      )}
    </li>
  );
}

interface NavigationListItemsProps {
  children: ReactNode;
  orientation: NavigationOrientation;
  role: "menu" | "menubar";
  className: string;
}

function NavigationListItems({ children, orientation, role, className }: NavigationListItemsProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<
    NavigationItemProps & NavigationItemInternalProps
  >[];
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const { next, prev } = KEY_MAP[orientation];

  const moveFocus = (resolveIndex: (currentIndex: number) => number) => {
    const list = listRef.current;
    if (!list || items.length === 0) {
      return;
    }
    const current = document.activeElement;
    const currentIndex = current ? indexOfTrigger(list, current) : -1;
    const nextIndex = resolveIndex(currentIndex);
    setActiveIndex(nextIndex);
    focusItemAt(list, nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === next) {
      event.preventDefault();
      moveFocus((currentIndex) => (currentIndex === -1 ? 0 : (currentIndex + 1) % items.length));
    } else if (event.key === prev) {
      event.preventDefault();
      moveFocus((currentIndex) =>
        currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length,
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(() => 0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(() => items.length - 1);
    }
  };

  return (
    <NavigationListContext.Provider value={{ orientation }}>
      <ul ref={listRef} role={role} className={className} onKeyDown={handleKeyDown}>
        {items.map((item, index) =>
          cloneElement(item, {
            key: item.key ?? index,
            __navIndex: index,
            __tabIndex: index === activeIndex ? 0 : -1,
            __onFocus: () => setActiveIndex(index),
          }),
        )}
      </ul>
    </NavigationListContext.Provider>
  );
}

/** Props accepted by {@link Navigation}. */
export interface NavigationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onSelect"> {
  /** Layout direction of the top-level list. Defaults to `"vertical"`. */
  orientation?: NavigationOrientation;
  /** Whether the outer container has a border. Defaults to `true`. */
  withBorder?: boolean;
  /** Whether the outer container and its items have a background color. Defaults to `false`, rendering the navigation transparent. */
  withBackground?: boolean;
  /** Whether the outer container stretches to fill its parent's width. Defaults to `true`. */
  fullWidth?: boolean;
  /** {@link Navigation.Item} elements making up the list. */
  children: ReactNode;
  /** Called with the `target` and index of the {@link Navigation.Item} that was clicked. */
  onSelect?: (target: string, index: number) => void;
}

/**
 * List of navigation entries, laid out vertically or horizontally.
 * {@link Navigation.Item}s that nest further items open a submenu instead of
 * navigating: in the vertical orientation, submenus unfold inline below
 * their trigger, indented to the right to read as a hierarchy; in the
 * horizontal orientation, top-level submenus open as a dropdown flyout.
 * Supports roving-tabindex keyboard navigation: arrow keys move between
 * siblings, the orientation's perpendicular arrow key opens/closes a
 * submenu, and Home/End/Escape behave as expected.
 *
 * @example
 * ```tsx
 * <Navigation onSelect={(target, index) => router.push(target)}>
 *   <Navigation.Item target="/" icon="home" label="Home" />
 *   <Navigation.Item label="Products">
 *     <Navigation.Item target="/products/new" label="New" />
 *     <Navigation.Item target="/products/archived" label="Archived" />
 *   </Navigation.Item>
 *   <Navigation.Item target="/settings" icon="settings" label="Settings" />
 * </Navigation>
 * ```
 */
export function Navigation({
  className,
  orientation = "vertical",
  withBorder = true,
  withBackground = false,
  fullWidth = true,
  onSelect,
  children,
  ...rest
}: NavigationProps) {
  return (
    <NavigationContext.Provider value={{ onSelect, rootOrientation: orientation }}>
      <nav
        className={cx(
          `eink-navigation eink-navigation--${orientation}`,
          ["eink-navigation--no-border", !withBorder],
          ["eink-navigation--with-background", withBackground],
          ["eink-navigation--full-width", fullWidth],
          [className ?? "", !!className],
        )}
        {...rest}
      >
        <NavigationListItems
          orientation={orientation}
          role={orientation === "horizontal" ? "menubar" : "menu"}
          className="eink-navigation__list"
        >
          {children}
        </NavigationListItems>
      </nav>
    </NavigationContext.Provider>
  );
}

Navigation.Item = NavigationItem;
