import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";
import "./heatmap.component.css";

/** Intensity of a cell: 0 is empty, 5 is the strongest. */
export type HeatmapLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** One day cell of a {@link Heatmap}. */
export interface HeatmapCell {
  /** Unique identifier passed to `onSelect`. */
  id: string;
  /** Intensity shade of the cell. */
  level: HeatmapLevel;
  /** Accessible description, e.g. "Mon 3 Nov: 2 of 3 done". */
  label: string;
  /** Renders an empty placeholder instead of the cell. */
  hidden?: boolean;
}

/** Props accepted by {@link Heatmap}. */
export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Columns of cells (e.g. weeks), each listing its cells top to bottom. */
  columns: readonly (readonly HeatmapCell[])[];
  /** Optional label above each column; `null` leaves it blank. */
  columnLabels?: readonly (string | null)[];
  /** Optional label left of each row. */
  rowLabels?: readonly string[];
  /** Identifier of the highlighted cell. */
  selectedId?: string | null;
  /** Called with the cell id when a cell is pressed. */
  onSelect?: (id: string) => void;
  /** Labels of the legend (`less`/`more`); the legend is hidden when omitted. */
  legend?: { less: string; more: string };
}

const LEGEND_LEVELS: readonly HeatmapLevel[] = [0, 1, 2, 3, 4, 5];

/**
 * Contribution-style grid where each cell's shade shows an intensity, with selectable cells
 * and an optional legend.
 *
 * @example
 * ```tsx
 * <Heatmap columns={weeks} selectedId={day} onSelect={setDay} legend={{ less: "Less", more: "More" }} />
 * ```
 */
export function Heatmap({
  className,
  columns,
  columnLabels,
  rowLabels,
  selectedId,
  onSelect,
  legend,
  ...rest
}: HeatmapProps) {
  return (
    <div className={cx("eink-heatmap", [className ?? "", !!className])} {...rest}>
      <div className="eink-heatmap__grid">
        {rowLabels ? (
          <div className="eink-heatmap__row-labels" aria-hidden="true">
            {columnLabels ? <span className="eink-heatmap__column-label" /> : null}
            {rowLabels.map((label, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static label list, positions are the identity
              <span key={index} className="eink-heatmap__row-label">
                {label}
              </span>
            ))}
          </div>
        ) : null}
        {columns.map((column, columnIndex) => (
          <div key={column[0]?.id ?? columnIndex} className="eink-heatmap__column">
            {columnLabels ? (
              <span className="eink-heatmap__column-label">{columnLabels[columnIndex] ?? ""}</span>
            ) : null}
            {column.map((cell) =>
              cell.hidden ? (
                <span key={cell.id} className="eink-heatmap__cell eink-heatmap__cell--hidden" />
              ) : (
                <button
                  key={cell.id}
                  type="button"
                  aria-label={cell.label}
                  aria-pressed={selectedId === cell.id}
                  className={cx(
                    "eink-heatmap__cell",
                    [`eink-heatmap__cell--level-${cell.level}`, true],
                    ["eink-heatmap__cell--selected", selectedId === cell.id],
                  )}
                  onClick={() => onSelect?.(cell.id)}
                />
              ),
            )}
          </div>
        ))}
      </div>
      {legend ? (
        <div
          className={cx("eink-heatmap__legend", [
            "eink-heatmap__legend--indented",
            rowLabels !== undefined,
          ])}
        >
          <span>{legend.less}</span>
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className={cx("eink-heatmap__cell", [`eink-heatmap__cell--level-${level}`, true])}
            />
          ))}
          <span>{legend.more}</span>
        </div>
      ) : null}
    </div>
  );
}
