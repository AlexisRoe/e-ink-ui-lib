import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./accordion.component.css";

interface AccordionContextValue {
  openId: string | null;
  toggle: (itemId: string) => void;
  claimInitialOpen: (itemId: string, openByDefault: boolean) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/** Props accepted by {@link Accordion}. */
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `id` of the {@link Accordion.Item} that should be open when the
   * accordion first renders. Falls back to the first item whose
   * `openByDefault` is `true` when omitted or when no item matches.
   */
  defaultOpenId?: string;
}

/** Props accepted by {@link Accordion.Item}. */
export interface AccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
  /** Bold summary shown full-width with the expand/collapse icon on the right. */
  summary: ReactNode;
  /**
   * Whether the item is open when rendered standalone (outside
   * {@link Accordion}). Ignored for items rendered inside {@link Accordion},
   * which controls open state itself. Defaults to `false`.
   */
  openByDefault?: boolean;
}

/**
 * Single collapsible section, using `<details>`/`<summary>` internally.
 * Can be rendered standalone or as a child of {@link Accordion}, which
 * takes over control of its open state so only one item stays open.
 *
 * @example
 * ```tsx
 * <Accordion.Item summary="Shipping">Ships within 3 days.</Accordion.Item>
 * ```
 */
function AccordionItem({
  className,
  summary,
  children,
  openByDefault = false,
  id,
  ...rest
}: AccordionItemProps) {
  const generatedId = useId();
  const itemId = id ?? generatedId;
  const context = useContext(AccordionContext);

  const [standaloneOpen, setStandaloneOpen] = useState(openByDefault);

  useEffect(() => {
    context?.claimInitialOpen(itemId, openByDefault);
  }, [context, itemId, openByDefault]);

  const isOpen = context ? context.openId === itemId : standaloneOpen;

  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (context) {
      context.toggle(itemId);
    } else {
      setStandaloneOpen((current) => !current);
    }
  };

  return (
    <details
      id={id}
      className={cx("eink-accordion-item", [className ?? "", !!className])}
      open={isOpen}
      {...rest}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: <summary> is a native interactive disclosure control; onClick intercepts it to drive the controlled `open` state instead of the browser's own toggle. */}
      <summary className="eink-accordion-item__summary" onClick={handleSummaryClick}>
        <span className="eink-accordion-item__summary-text">{summary}</span>
        <Icon
          name={isOpen ? "minus" : "plus"}
          className="eink-accordion-item__icon"
          aria-hidden="true"
        />
      </summary>
      <div className="eink-accordion-item__content">{children}</div>
    </details>
  );
}

/**
 * Group of {@link Accordion.Item}s where only one item is open at a time.
 * Opening an item closes any other open item. Coordinates its items via
 * context, so items don't need to be direct children.
 *
 * @example
 * ```tsx
 * <Accordion defaultOpenId="shipping">
 *   <Accordion.Item id="shipping" summary="Shipping">Ships within 3 days.</Accordion.Item>
 *   <Accordion.Item id="returns" summary="Returns">30-day returns.</Accordion.Item>
 * </Accordion>
 * ```
 */
export function Accordion({ className, children, defaultOpenId, ...rest }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const hasClaimedRef = useRef(false);
  const fallbackIdRef = useRef<string | null>(null);

  const claimInitialOpen = useCallback(
    (itemId: string, openByDefault: boolean) => {
      if (hasClaimedRef.current) {
        return;
      }
      if (defaultOpenId) {
        if (itemId === defaultOpenId) {
          hasClaimedRef.current = true;
          setOpenId(itemId);
        } else if (openByDefault && fallbackIdRef.current === null) {
          fallbackIdRef.current = itemId;
        }
        return;
      }
      if (openByDefault) {
        hasClaimedRef.current = true;
        setOpenId(itemId);
      }
    },
    [defaultOpenId],
  );

  useEffect(() => {
    if (!hasClaimedRef.current && fallbackIdRef.current) {
      hasClaimedRef.current = true;
      setOpenId(fallbackIdRef.current);
    }
  }, []);

  const toggle = useCallback((itemId: string) => {
    setOpenId((current) => (current === itemId ? null : itemId));
  }, []);

  const contextValue = useMemo<AccordionContextValue>(
    () => ({ openId, toggle, claimInitialOpen }),
    [openId, toggle, claimInitialOpen],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cx("eink-accordion", [className ?? "", !!className])} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
