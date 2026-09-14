import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";

import "./dropdown-menu.component.css";

/** Side a {@link DropdownMenu.Item} submenu flies out on. */
export type DropdownMenuSide = "left" | "right";

interface DropdownMenuContextValue {
  onSelect?: (id: string) => void;
  closeAll: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({
  closeAll: () => {},
});

/** Props accepted by {@link DropdownMenu.Item}. */
export interface DropdownMenuItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id" | "children" | "onSelect"> {
  /** Identifier reported to {@link DropdownMenuProps.onSelect} when this item is chosen. */
  id: string;
  /** Optional icon shown before the label. */
  icon?: IconName;
  /** Optional key-combination hint shown at the end of the row (e.g. `"⌘K"`). */
  keys?: string;
  /** Disables the item: light grey background, no interaction. */
  disabled?: boolean;
  /** When true and `disabled`, renders a diagonal-stripe pattern instead of the flat grey background. */
  mono?: boolean;
  /**
   * Side the submenu opens on, when this item nests other
   * {@link DropdownMenu.Item} elements. Defaults to flipping automatically
   * (opens right, flips to left if it would overflow the viewport).
   */
  side?: DropdownMenuSide;
  /** Label content, optionally mixed with nested {@link DropdownMenu.Item} elements that turn this row into a submenu trigger. */
  children: ReactNode;
}

/**
 * Single row of a {@link DropdownMenu} or {@link DropdownMenu.Group}. Its
 * label is its non-{@link DropdownMenu.Item} `children`; any
 * `DropdownMenu.Item` elements mixed into `children` become a submenu that
 * flies out to the side instead of the row calling `onSelect`.
 *
 * @example
 * ```tsx
 * <DropdownMenu.Item id="copy" icon="copy" keys="⌘C">Copy</DropdownMenu.Item>
 * <DropdownMenu.Item id="share" icon="share">
 *   Share
 *   <DropdownMenu.Item id="share-link">Copy link</DropdownMenu.Item>
 *   <DropdownMenu.Item id="share-email">Email</DropdownMenu.Item>
 * </DropdownMenu.Item>
 * ```
 */
function DropdownMenuItem({
  className,
  id,
  icon,
  keys,
  disabled = false,
  mono = false,
  side,
  children,
  ...rest
}: DropdownMenuItemProps) {
  const { onSelect, closeAll } = useContext(DropdownMenuContext);
  const [isOpen, setIsOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<DropdownMenuSide>(side ?? "right");

  const itemRef = useRef<HTMLLIElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);

  const submenuItems = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === DropdownMenuItem,
  );
  const label = Children.toArray(children).filter(
    (child) => !(isValidElement(child) && child.type === DropdownMenuItem),
  );
  const hasSubmenu = submenuItems.length > 0;

  useLayoutEffect(() => {
    if (!hasSubmenu || !isOpen || side) {
      return;
    }
    const submenu = submenuRef.current;
    if (!submenu) {
      return;
    }
    const { right } = submenu.getBoundingClientRect();
    setResolvedSide(right > window.innerWidth ? "left" : "right");
  }, [hasSubmenu, isOpen, side]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      if (!itemRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    if (hasSubmenu) {
      event.stopPropagation();
      setIsOpen((current) => !current);
      return;
    }
    onSelect?.(id);
    closeAll();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  };

  return (
    <li
      ref={itemRef}
      role="none"
      className={cx("eink-dropdown-menu-item", [className ?? "", !!className])}
      {...rest}
    >
      <button
        type="button"
        role="menuitem"
        className={cx(
          "eink-dropdown-menu-item__row",
          ["eink-dropdown-menu-item__row--disabled", disabled],
          ["eink-dropdown-menu-item__row--mono", disabled && mono],
        )}
        disabled={disabled}
        aria-haspopup={hasSubmenu ? "menu" : undefined}
        aria-expanded={hasSubmenu ? isOpen : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {icon && (
          <Icon
            name={icon}
            size={16}
            className="eink-dropdown-menu-item__icon"
            aria-hidden="true"
          />
        )}
        <span className="eink-dropdown-menu-item__label">{label}</span>
        {keys && !hasSubmenu && <span className="eink-dropdown-menu-item__keys">{keys}</span>}
        {hasSubmenu && (
          <Icon
            name={resolvedSide === "left" ? "chevron-left" : "chevron-right"}
            size={16}
            className="eink-dropdown-menu-item__chevron"
            aria-hidden="true"
          />
        )}
      </button>
      {hasSubmenu && isOpen && (
        <ul
          ref={submenuRef}
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: menu semantics require a ul/li structure, matching Navigation's submenu.
          role="menu"
          className={cx("eink-dropdown-menu-item__submenu", [
            "eink-dropdown-menu-item__submenu--left",
            resolvedSide === "left",
          ])}
        >
          {submenuItems}
        </ul>
      )}
    </li>
  );
}

/** Props accepted by {@link DropdownMenu.Group}. */
export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Optional heading shown in a filled black bar above the group's items. */
  label?: ReactNode;
  /** {@link DropdownMenu.Item} elements making up the group. */
  children: ReactNode;
}

/**
 * Groups {@link DropdownMenu.Item} rows inside a {@link DropdownMenu},
 * separated from the group above it by a black divider line. An optional
 * `label` renders as a filled black heading bar above the group's items.
 *
 * @example
 * ```tsx
 * <DropdownMenu.Group label="Document">
 *   <DropdownMenu.Item id="cut">Cut</DropdownMenu.Item>
 *   <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
 * </DropdownMenu.Group>
 * ```
 */
function DropdownMenuGroup({ className, label, children, ...rest }: DropdownMenuGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset can't be a child of an unordered menu list; role="group" on ul matches the surrounding menu semantics.
    <ul
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
      className={cx("eink-dropdown-menu-group", [className ?? "", !!className])}
      {...rest}
    >
      {label && (
        <li className="eink-dropdown-menu-group__label" aria-hidden="true">
          {label}
        </li>
      )}
      {children}
    </ul>
  );
}

/** Props accepted by {@link DropdownMenu}. */
export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Label of the trigger button that opens the menu. */
  label: ReactNode;
  /** Disables the trigger button. */
  disabled?: boolean;
  /** {@link DropdownMenu.Item} / {@link DropdownMenu.Group} elements making up the menu. */
  children: ReactNode;
  /** Called with the `id` of the {@link DropdownMenu.Item} that was chosen. */
  onSelect?: (id: string) => void;
}

/**
 * Button that opens a dropdown menu of grouped, optionally-nested actions
 * below it. Menu rows ({@link DropdownMenu.Item}) can carry an optional
 * icon on the left and a key-combination hint on the right, can be grouped
 * with {@link DropdownMenu.Group} (divided by a black line), can be
 * `disabled` (with an optional `mono` diagonal-stripe look instead of flat
 * grey), and can nest further items to become a submenu that flies out to
 * the side.
 *
 * @example
 * ```tsx
 * <DropdownMenu label="Actions" onSelect={(id) => console.log(id)}>
 *   <DropdownMenu.Group>
 *     <DropdownMenu.Item id="edit" icon="edit" keys="⌘E">Edit</DropdownMenu.Item>
 *     <DropdownMenu.Item id="duplicate" icon="copy">Duplicate</DropdownMenu.Item>
 *   </DropdownMenu.Group>
 *   <DropdownMenu.Group>
 *     <DropdownMenu.Item id="delete" icon="trash" disabled>Delete</DropdownMenu.Item>
 *   </DropdownMenu.Group>
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu({
  className,
  label,
  disabled = false,
  children,
  onSelect,
  ...rest
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeAll = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ onSelect, closeAll }}>
      <div
        ref={containerRef}
        className={cx("eink-dropdown-menu", [className ?? "", !!className])}
        {...rest}
      >
        <Button
          type="button"
          disabled={disabled}
          className="eink-dropdown-menu__trigger"
          iconRight={open ? "chevron-up" : "chevron-down"}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {label}
        </Button>
        {open && (
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: menu semantics require a ul/li structure, matching Navigation's list.
          <ul role="menu" className="eink-dropdown-menu__list">
            {children}
          </ul>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Group = DropdownMenuGroup;
