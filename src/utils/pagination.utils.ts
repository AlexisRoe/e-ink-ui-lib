/** A visible page number, or a gap between two non-adjacent page numbers. */
export type PaginationRangeItem = number | "ellipsis";

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
}

/**
 * Computes which page numbers should be rendered for a pagination control
 * with `pageCount` pages and a current `page`, always keeping the first and
 * last page visible plus `siblingCount` pages on either side of `page`.
 * Non-adjacent runs of hidden pages collapse into a single `"ellipsis"`
 * entry so the control stays a fixed, predictable width regardless of how
 * many pages exist.
 *
 * @param page - Current page, 1-indexed.
 * @param pageCount - Total number of pages.
 * @param siblingCount - Pages to show on each side of `page`. Defaults to `1`.
 * @returns Ordered list of page numbers and `"ellipsis"` gap markers.
 *
 * @example
 * ```ts
 * getPaginationRange(5, 20) // [1, "ellipsis", 4, 5, 6, "ellipsis", 20]
 * ```
 */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  if (pageCount <= 0) return [];

  const totalVisible = siblingCount * 2 + 5;
  if (totalVisible >= pageCount) return range(1, pageCount);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, pageCount);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, "ellipsis", pageCount];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(pageCount - (3 + siblingCount * 2) + 1, pageCount);
    return [1, "ellipsis", ...rightRange];
  }

  return [1, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", pageCount];
}
