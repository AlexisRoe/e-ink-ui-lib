import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { cx } from "../../utils/cx.utils";

import "./segmented.component.css";

interface SegmentedContextValue {
  value: string | null;
  select: (itemId: string) => void;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

/** Props accepted by {@link Segmented}. */
export interface SegmentedProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** `id` of the {@link Segmented.Item} highlighted when the control first renders. */
  defaultId?: string;
  /** Stretches the control to 100% width, with segments evenly distributed. Defaults to `false`. */
  fullWidth?: boolean;
  /** Called with the `id` of the segment that was clicked. */
  onChange?: (id: string) => void;
}

/** Props accepted by {@link Segmented.Item}. */
export interface SegmentedItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id"> {
  /** Identifies this segment; passed to `onChange` and matched against `defaultId`. */
  id: string;
  /** Segment label. */
  children: ReactNode;
}

/**
 * Single option of a {@link Segmented} control. Can only be used inside
 * {@link Segmented}, which it reads its selected/click behavior from via
 * context.
 *
 * @example
 * ```tsx
 * <Segmented.Item id="week">Week</Segmented.Item>
 * ```
 */
function SegmentedItem({ className, id, children, ...rest }: SegmentedItemProps) {
  const context = useContext(SegmentedContext);
  const isSelected = context?.value === id;

  return (
    <li className="eink-segmented__item-wrapper">
      <button
        type="button"
        className={cx(
          "eink-segmented__item",
          [className ?? "", !!className],
          ["eink-segmented__item--selected", isSelected],
        )}
        aria-pressed={isSelected}
        onClick={() => context?.select(id)}
        {...rest}
      >
        {children}
      </button>
    </li>
  );
}

/**
 * Row of mutually-exclusive {@link Segmented.Item}s, highlighting the
 * selected one and reporting clicks via `onChange`.
 *
 * @example
 * ```tsx
 * <Segmented defaultId="month" onChange={(id) => setRange(id)}>
 *   <Segmented.Item id="day">Day</Segmented.Item>
 *   <Segmented.Item id="week">Week</Segmented.Item>
 *   <Segmented.Item id="month">Month</Segmented.Item>
 *   <Segmented.Item id="year">Year</Segmented.Item>
 * </Segmented>
 * ```
 */
export function Segmented({
  className,
  children,
  defaultId,
  fullWidth = false,
  onChange,
  ...rest
}: SegmentedProps) {
  const [value, setValue] = useState<string | null>(defaultId ?? null);

  const select = (itemId: string) => {
    setValue(itemId);
    onChange?.(itemId);
  };

  return (
    <SegmentedContext.Provider value={{ value, select }}>
      <nav
        className={cx(
          "eink-segmented",
          [className ?? "", !!className],
          ["eink-segmented--full-width", fullWidth],
        )}
        {...rest}
      >
        <ul className="eink-segmented__list">{children}</ul>
      </nav>
    </SegmentedContext.Provider>
  );
}

Segmented.Item = SegmentedItem;
