import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";
import { cx } from "../theme/theme.provider";
import "./List.component.css";

/**
 * List style rendered by {@link List}. `"unordered"` renders a `<ul>` with
 * square bullets, `"ordered"` renders an `<ol>` with numbers, and
 * `"detailed"` renders a bordered `<ul>` whose items show a title and
 * description (see {@link ListItemProps}). Defaults to `"unordered"`.
 */
export type ListAs = "unordered" | "ordered" | "detailed";

/** Props accepted by {@link List}. */
export interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /** `"unordered"`, `"ordered"`, or `"detailed"`. Defaults to `"unordered"`. */
  as?: ListAs;
}

/** Props accepted by {@link ListItem}. */
export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** Bold title, used by the `"detailed"` {@link List} variant instead of `children`. */
  title?: ReactNode;
  /** Supporting description, used by the `"detailed"` {@link List} variant instead of `children`. */
  description?: ReactNode;
}

/**
 * List component rendering `<ul>` (default), `<ol>`, or a bordered
 * title/description layout via `as`. Unordered items use a small black
 * square marker instead of the browser default. Use with {@link ListItem}
 * for list rows.
 *
 * @example
 * ```tsx
 * <List>
 *   <List.Item>First</List.Item>
 *   <List.Item>Second</List.Item>
 * </List>
 * <List as="ordered">
 *   <List.Item>First</List.Item>
 *   <List.Item>Second</List.Item>
 * </List>
 * <List as="detailed">
 *   <List.Item title="Annual report" description="Finance · 2026" />
 *   <List.Item title="Roadmap" description="Product · 2026" />
 * </List>
 * ```
 */
export function List({ as = "unordered", className, children, ...rest }: ListProps) {
  const Tag = as === "ordered" ? "ol" : "ul";

  return (
    <Tag
      className={cx(`eink-list eink-list--${as}`, [className ?? "", !!className])}
      {...(rest as HTMLAttributes<HTMLUListElement & HTMLOListElement>)}
    >
      {children}
    </Tag>
  );
}

/** List item, used inside {@link List}. Also available as {@link List.Item}. */
export function ListItem({ className, children, title, description, ...rest }: ListItemProps) {
  return (
    <li className={cx("eink-list__item", [className ?? "", !!className])} {...rest}>
      {title !== undefined || description !== undefined ? (
        <span className="eink-list__item-content">
          {title !== undefined ? <span className="eink-list__item-title">{title}</span> : null}
          {description !== undefined ? (
            <span className="eink-list__item-description">{description}</span>
          ) : null}
        </span>
      ) : (
        children
      )}
    </li>
  );
}

List.Item = ListItem;
