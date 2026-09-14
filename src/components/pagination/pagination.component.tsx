import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";
import { getPaginationRange } from "../../utils/pagination.utils";
import { Icon } from "../icons/icon";

import "./pagination.component.css";

/** Props accepted by {@link Pagination.Item}. */
export interface PaginationItemProps {
  /** Page number this item represents (1-indexed). */
  page: number;
  /** Whether this item represents the currently active page. */
  current?: boolean;
  /** Called when the item is clicked. */
  onClick?: (page: number) => void;
}

/**
 * Single page-number button of a {@link Pagination} control. Rendered
 * internally by {@link Pagination}; exported for consumers who want to
 * build a custom page-number layout while keeping the same styling.
 *
 * @example
 * ```tsx
 * <Pagination.Item page={3} current onClick={setPage} />
 * ```
 */
function PaginationItem({ page, current, onClick }: PaginationItemProps) {
  return (
    <li className="eink-pagination__item">
      <button
        type="button"
        className={cx("eink-pagination__button", ["eink-pagination__button--current", !!current])}
        aria-current={current ? "page" : undefined}
        aria-label={`Page ${page}`}
        onClick={() => onClick?.(page)}
      >
        {page}
      </button>
    </li>
  );
}

/** Props accepted by {@link Pagination}. */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages. */
  pageCount: number;
  /** Currently active page, 1-indexed. */
  page: number;
  /** Called with the new page number when the user navigates. */
  onPageChange?: (page: number) => void;
  /** Pages to show on each side of the current page. Defaults to `1`. */
  siblingCount?: number;
}

/**
 * Page navigation control for tables, datasheets, or paginated documents,
 * built for e-ink screens: high-contrast bordered buttons, no hover-only
 * affordances, and a fixed-width layout that stays legible at any page
 * count. Always renders the first and last page plus the current page and
 * its siblings, collapsing any gap in between into a single filler marker
 * so the control never overflows the available width.
 *
 * @example
 * ```tsx
 * <Pagination pageCount={42} page={page} onPageChange={setPage} />
 * ```
 */
export function Pagination({
  pageCount,
  page,
  onPageChange,
  siblingCount = 1,
  className,
  ...rest
}: PaginationProps) {
  const items = getPaginationRange(page, pageCount, siblingCount);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  function goTo(target: number) {
    if (target < 1 || target > pageCount || target === page) return;
    onPageChange?.(target);
  }

  return (
    <nav
      className={cx("eink-pagination", [className ?? "", !!className])}
      aria-label="Pagination"
      {...rest}
    >
      <ul className="eink-pagination__list">
        <li className="eink-pagination__item">
          <button
            type="button"
            className="eink-pagination__button eink-pagination__button--control"
            aria-label="First page"
            disabled={isFirst}
            onClick={() => goTo(1)}
          >
            <Icon name="chevrons-left" size={16} />
          </button>
        </li>
        <li className="eink-pagination__item">
          <button
            type="button"
            className="eink-pagination__button eink-pagination__button--control"
            aria-label="Previous page"
            disabled={isFirst}
            onClick={() => goTo(page - 1)}
          >
            <Icon name="chevron-left" size={16} />
          </button>
        </li>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no stable identity, and there are at most two per render
            <li className="eink-pagination__item" key={`ellipsis-${index}`}>
              <span className="eink-pagination__ellipsis" aria-hidden="true">
                <span className="eink-pagination__ellipsis-dot" />
                <span className="eink-pagination__ellipsis-dot" />
                <span className="eink-pagination__ellipsis-dot" />
              </span>
            </li>
          ) : (
            <PaginationItem key={item} page={item} current={item === page} onClick={goTo} />
          ),
        )}

        <li className="eink-pagination__item">
          <button
            type="button"
            className="eink-pagination__button eink-pagination__button--control"
            aria-label="Next page"
            disabled={isLast}
            onClick={() => goTo(page + 1)}
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </li>
        <li className="eink-pagination__item">
          <button
            type="button"
            className="eink-pagination__button eink-pagination__button--control"
            aria-label="Last page"
            disabled={isLast}
            onClick={() => goTo(pageCount)}
          >
            <Icon name="chevrons-right" size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.Item = PaginationItem;
