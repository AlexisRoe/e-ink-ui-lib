import type { HTMLAttributes, ReactNode } from "react";
import { move } from "../../utils/array.utils";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { List } from "../list/list.component";

import "./order-list.component.css";

/** Accessible labels of the {@link OrderList} move buttons. */
export interface OrderListLabels<T> {
  /** Label of the "move up" button. Defaults to `"Move item N up"`. */
  moveUp?: (item: T, index: number) => string;
  /** Label of the "move down" button. Defaults to `"Move item N down"`. */
  moveDown?: (item: T, index: number) => string;
}

/** Props accepted by {@link OrderList}. */
export interface OrderListProps<T> extends Omit<HTMLAttributes<HTMLOListElement>, "onChange"> {
  /** Items in their current order. */
  items: readonly T[];
  /** Called with the reordered items when an item is moved. */
  onChange: (items: T[]) => void;
  /** Stable unique key of an item. */
  getKey: (item: T) => string;
  /** Renders the content of an item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional content after the move buttons of an item, e.g. a result `Pill`. */
  renderSuffix?: (item: T, index: number) => ReactNode;
  /** Overrides for the accessible move button labels, e.g. for translation. */
  labels?: OrderListLabels<T>;
  /** Disables all move buttons. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * Numbered list whose items can be reordered with up and down buttons, with
 * no drag and drop, so it works on e-ink screens and with the keyboard. The
 * list is controlled: it reports the new order via `onChange`. The first
 * item cannot move up and the last cannot move down.
 *
 * @example
 * ```tsx
 * const [steps, setSteps] = useState(["Plan", "Build", "Test"]);
 * <OrderList
 *   items={steps}
 *   onChange={setSteps}
 *   getKey={(step) => step}
 *   renderItem={(step) => step}
 * />
 * ```
 */
export function OrderList<T>({
  items,
  onChange,
  getKey,
  renderItem,
  renderSuffix,
  labels,
  disabled = false,
  className,
  ...rest
}: OrderListProps<T>) {
  return (
    <List as="ordered" className={cx("eink-order-list", [className ?? "", !!className])} {...rest}>
      {items.map((item, index) => (
        <List.Item key={getKey(item)}>
          <span className="eink-order-list__content">{renderItem(item, index)}</span>
          <span className="eink-order-list__controls">
            <Button.IconOutlined
              icon="arrow-up"
              size="sm"
              aria-label={labels?.moveUp?.(item, index) ?? `Move item ${index + 1} up`}
              disabled={disabled || index === 0}
              onClick={() => onChange(move(items, index, -1))}
            />
            <Button.IconOutlined
              icon="arrow-down"
              size="sm"
              aria-label={labels?.moveDown?.(item, index) ?? `Move item ${index + 1} down`}
              disabled={disabled || index === items.length - 1}
              onClick={() => onChange(move(items, index, 1))}
            />
            {renderSuffix?.(item, index)}
          </span>
        </List.Item>
      ))}
    </List>
  );
}
