import type {
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  ThHTMLAttributes,
} from "react";
import { Children, cloneElement, createContext, isValidElement, useContext, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./table.component.css";

interface TableContextValue {
  selectedIndexes: Set<number>;
  toggleRow: (index: number) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

/**
 * Diagonal black-stripe pattern painted over a disabled row when the parent
 * {@link Table} has `mono` enabled.
 */
function DiagonalStripes() {
  return (
    <div className="eink-table-row__stripes" aria-hidden="true">
      <PatternOverlay
        className="eink-table-row__stripes-svg"
        role="presentation"
        size={4}
        stroke="currentColor"
      />
    </div>
  );
}

/** Props accepted by {@link Table.HeaderCell}. */
export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>;

/**
 * Single column heading of a {@link Table}, rendered in the inverted header
 * row.
 *
 * @example
 * ```tsx
 * <Table.HeaderCell>Name</Table.HeaderCell>
 * ```
 */
function TableHeaderCell({ className, children, ...rest }: TableHeaderCellProps) {
  return (
    <th className={cx("eink-table-header-cell", [className ?? "", !!className])} {...rest}>
      {children}
    </th>
  );
}

/** Props accepted by {@link Table.Head}. */
export interface TableHeadProps extends Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> {
  /** {@link Table.HeaderCell} elements, one per column. */
  children: ReactNode;
}

/**
 * Header row of a {@link Table}, composing {@link Table.HeaderCell} for each
 * column.
 *
 * @example
 * ```tsx
 * <Table.Head>
 *   <Table.HeaderCell>Name</Table.HeaderCell>
 *   <Table.HeaderCell>Role</Table.HeaderCell>
 * </Table.Head>
 * ```
 */
function TableHead({ className, children, ...rest }: TableHeadProps) {
  return (
    <thead className={cx("eink-table-head", [className ?? "", !!className])} {...rest}>
      <tr>{children}</tr>
    </thead>
  );
}

/** Props accepted by {@link Table.Cell}. */
export type TableCellProps = HTMLAttributes<HTMLTableCellElement>;

/**
 * Single data cell of a {@link Table.Row}.
 *
 * @example
 * ```tsx
 * <Table.Cell>Anna König</Table.Cell>
 * ```
 */
function TableCell({ className, children, ...rest }: TableCellProps) {
  return (
    <td className={cx("eink-table-cell", [className ?? "", !!className])} {...rest}>
      {children}
    </td>
  );
}

/** Props accepted by {@link Table.Row}. */
export interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, "onClick"> {
  /** {@link Table.Cell} elements forming this row. */
  children: ReactNode;
  /** Whether this row can be selected by clicking it or via keyboard. Defaults to `true`. */
  selectable?: boolean;
  /**
   * Whether this row is disabled: not selectable, dimmed, and shown with a
   * grey background (or, when the parent {@link Table} has `mono` enabled,
   * a diagonal black-stripe pattern instead). Defaults to `false`.
   */
  disabled?: boolean;
}

interface TableRowInternalProps extends TableRowProps {
  index?: number;
  mono?: boolean;
}

/**
 * Single selectable row of a {@link Table}. Clicking the row, or pressing
 * Enter/Space while it is focused, toggles its selection, inverting its
 * colors; the parent {@link Table} reports the set of selected row indexes
 * via {@link TableProps.onSelectionChange}.
 *
 * @example
 * ```tsx
 * <Table.Row>
 *   <Table.Cell>Anna König</Table.Cell>
 *   <Table.Cell>Editor</Table.Cell>
 * </Table.Row>
 * ```
 */
function TableRow({
  className,
  index = 0,
  mono = false,
  selectable = true,
  disabled = false,
  children,
  ...rest
}: TableRowInternalProps) {
  const context = useContext(TableContext);
  const canSelect = selectable && !disabled;
  const selected = canSelect && (context?.selectedIndexes.has(index) ?? false);

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    context?.toggleRow(index);
  };

  return (
    <tr
      className={cx(
        "eink-table-row",
        ["eink-table-row--selectable", canSelect],
        ["eink-table-row--disabled", disabled && !mono],
        ["eink-table-row--disabled-mono", disabled && mono],
        ["eink-invert-colors", selected],
        [className ?? "", !!className],
      )}
      aria-selected={canSelect ? selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={canSelect ? 0 : undefined}
      onClick={canSelect ? () => context?.toggleRow(index) : undefined}
      onKeyDown={canSelect ? handleKeyDown : undefined}
      {...rest}
    >
      {children}
      {disabled && mono && <DiagonalStripes />}
    </tr>
  );
}

/** Props accepted by {@link Table.Body}. */
export interface TableBodyProps extends Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> {
  /** {@link Table.Row} elements forming the table's data rows. */
  children?: ReactNode;
  /** Content shown in place of rows when there are none. Defaults to a "no rows" icon. */
  emptyLabel?: ReactNode;
}

interface TableBodyInternalProps extends TableBodyProps {
  columnCount?: number;
}

/**
 * Body of a {@link Table}, composing {@link Table.Row} for each data row.
 * Renders {@link TableBodyProps.emptyLabel} in a single fullwidth cell when
 * there are no rows.
 *
 * @example
 * ```tsx
 * <Table.Body>
 *   <Table.Row>
 *     <Table.Cell>Anna König</Table.Cell>
 *   </Table.Row>
 * </Table.Body>
 * ```
 */
function TableBody({
  className,
  emptyLabel,
  columnCount = 1,
  children,
  ...rest
}: TableBodyInternalProps) {
  const isEmpty = Children.count(children) === 0;

  return (
    <tbody className={cx("eink-table-body", [className ?? "", !!className])} {...rest}>
      {isEmpty ? (
        <tr className="eink-table-row eink-table-row--empty">
          <td className="eink-table-cell eink-table-cell--empty" colSpan={columnCount}>
            {emptyLabel ?? <Icon name="list" className="eink-table-cell__empty-icon" />}
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  );
}

/** Props accepted by {@link Table}. */
export interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, "onSelect"> {
  /** {@link Table.Head} and {@link Table.Body} elements. */
  children: ReactNode;
  /** Called with the sorted array of selected row indexes whenever selection changes. */
  onSelectionChange?: (selectedIndexes: number[]) => void;
  /** Row indexes selected when the table first renders. */
  preselectedIndexes?: number[];
  /**
   * Whether disabled rows show a diagonal black-stripe pattern instead of a
   * grey background. Defaults to `false`.
   */
  mono?: boolean;
  /** Whether the header row stays pinned to the top of the nearest scroll container. Defaults to `false`. */
  stickyHeader?: boolean;
}

/**
 * Number of columns declared by any `Table.Head` among `children`, used to
 * size the fullwidth cell of an empty `Table.Body` so it doesn't inflate the
 * table's total column count (an oversized `colSpan` would otherwise shrink
 * every other row to a sliver).
 */
function countColumns(children: ReactNode): number {
  let count = 1;
  Children.forEach(children, (child) => {
    if (isValidElement<TableHeadProps>(child) && child.type === TableHead) {
      count = Math.max(count, Children.count(child.props.children));
    }
  });
  return count;
}

/**
 * Recursively walks `Table.Head`/`Table.Body` children, assigning each
 * `Table.Row` a table-wide sequential index (so rows keep unique indexes
 * even when split across multiple `Table.Body` sections) and reports
 * whether every `Table.Body` found was empty.
 */
function processChildren(
  children: ReactNode,
  mono: boolean,
  columnCount: number,
  counter: { current: number },
): { children: ReactNode; hasRows: boolean } {
  let hasRows = false;

  const processed = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }
    if (child.type === TableRow) {
      hasRows = true;
      return cloneElement(child as ReactElement<TableRowInternalProps>, {
        index: counter.current++,
        mono,
      });
    }
    if (child.type === TableBody) {
      const bodyProps = child.props as TableBodyProps;
      const result = processChildren(bodyProps.children, mono, columnCount, counter);
      hasRows = hasRows || result.hasRows;
      return cloneElement(child as ReactElement<TableBodyInternalProps>, {
        children: result.children,
        columnCount,
      });
    }
    return child;
  });

  return { children: processed, hasRows };
}

/**
 * Fullwidth table with an inverted (black) header row and selectable data
 * rows. Composes {@link Table.Head}, {@link Table.Body}, {@link Table.Row},
 * {@link Table.Cell}, and {@link Table.HeaderCell}. Clicking a row, or
 * selecting it via keyboard, inverts its colors and reports the full set of
 * selected row indexes. When {@link Table.Body} has no rows, its bottom
 * border switches to dashed.
 *
 * @example
 * ```tsx
 * <Table onSelectionChange={(indexes) => console.log(indexes)}>
 *   <Table.Head>
 *     <Table.HeaderCell>Name</Table.HeaderCell>
 *     <Table.HeaderCell>Role</Table.HeaderCell>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Anna König</Table.Cell>
 *       <Table.Cell>Editor</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
export function Table({
  className,
  children,
  onSelectionChange,
  preselectedIndexes,
  mono = false,
  stickyHeader = false,
  ...rest
}: TableProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    () => new Set(preselectedIndexes),
  );

  const toggleRow = (index: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      onSelectionChange?.([...next].sort((a, b) => a - b));
      return next;
    });
  };

  const { children: processedChildren, hasRows } = processChildren(
    children,
    mono,
    countColumns(children),
    { current: 0 },
  );

  return (
    <TableContext.Provider value={{ selectedIndexes, toggleRow }}>
      <table
        className={cx(
          "eink-table",
          ["eink-table--sticky-header", stickyHeader],
          ["eink-table--empty", !hasRows],
          [className ?? "", !!className],
        )}
        {...rest}
      >
        {processedChildren}
      </table>
    </TableContext.Provider>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;
