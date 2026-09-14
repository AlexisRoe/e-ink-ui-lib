import type { HTMLAttributes, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./breadcrumbs.component.css";

/** Props accepted by {@link BreadCrumbs}. */
export interface BreadCrumbsProps extends HTMLAttributes<HTMLElement> {
  /** {@link BreadCrumbs.Item} elements making up the trail. */
  children: ReactNode;
  /** Called with the `target` of the {@link BreadCrumbs.Item} that was clicked. */
  onNavigate?: (target: string) => void;
}

/** Props accepted by {@link BreadCrumbs.Item}. */
export interface BreadCrumbsItemProps {
  /** Destination this item represents, passed to `onNavigate` when clicked. */
  target: string;
  /** Item label. */
  children: ReactNode;
}

/**
 * Single step of a {@link BreadCrumbs} trail. Can only be used inside
 * {@link BreadCrumbs}, which reads its `target` to report clicks.
 *
 * @example
 * ```tsx
 * <BreadCrumbs.Item target="/settings">Settings</BreadCrumbs.Item>
 * ```
 */
function BreadCrumbsItem({ children }: BreadCrumbsItemProps) {
  return <>{children}</>;
}

/**
 * Page navigation trail. Renders a house icon before the first
 * {@link BreadCrumbs.Item} and a `/` separator between items; clicking an
 * item calls `onNavigate` with its `target`.
 *
 * @example
 * ```tsx
 * <BreadCrumbs onNavigate={(target) => router.push(target)}>
 *   <BreadCrumbs.Item target="/">Home</BreadCrumbs.Item>
 *   <BreadCrumbs.Item target="/settings">Settings</BreadCrumbs.Item>
 *   <BreadCrumbs.Item target="/settings/profile">Profile</BreadCrumbs.Item>
 * </BreadCrumbs>
 * ```
 */
export function BreadCrumbs({ className, children, onNavigate, ...rest }: BreadCrumbsProps) {
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<BreadCrumbsItemProps> =>
      isValidElement(child) && child.type === BreadCrumbsItem,
  );

  return (
    <nav className={cx("eink-breadcrumbs", [className ?? "", !!className])} {...rest}>
      <ol className="eink-breadcrumbs__list">
        {items.map((item, index) => (
          <li className="eink-breadcrumbs__item-wrapper" key={item.props.target}>
            {index > 0 && (
              <span className="eink-breadcrumbs__separator" aria-hidden="true">
                /
              </span>
            )}
            <button
              type="button"
              className="eink-breadcrumbs__item"
              onClick={() => onNavigate?.(item.props.target)}
            >
              {index === 0 && <Icon name="home" className="eink-breadcrumbs__icon" size={16} />}
              {item.props.children}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

BreadCrumbs.Item = BreadCrumbsItem;
