import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./number.component.css";

/**
 * Digit grouping strategy applied to the integer part of the value.
 * - `"thousands"` — groups of 3 digits (e.g. `1,000,000`).
 * - `"lakh"` — Indian numbering system: 3 digits, then groups of 2 (e.g. `10,00,000`).
 * - `"wan"` — East Asian numbering system: groups of 4 digits (e.g. `1,0000,0000`).
 * - `"none"` — no grouping separators.
 */
export type NumberGroupingBy = "thousands" | "lakh" | "wan" | "none";

/**
 * Which characters are used as the thousands and decimal separators.
 * - `"eu"` — `.` for thousands, `,` for decimals (e.g. `1.234,56`).
 * - `"us"` — `,` for thousands, `.` for decimals (e.g. `1,234.56`).
 */
export type NumberSeparatorStyle = "eu" | "us";

/** Props accepted by {@link Number}. */
export interface NumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The numeric value to display. */
  value: number;
  /** Text rendered before the value, e.g. a currency symbol. */
  prefix?: string;
  /** Text rendered after the value, e.g. a unit. */
  suffix?: string;
  /** Number of decimal places to round to. Defaults to `false` (no rounding). */
  roundDecimal?: number | false;
  /** Digit grouping strategy for the integer part. Defaults to `"none"`. */
  groupingBy?: NumberGroupingBy;
  /** Thousands/decimal separator characters to use. Defaults to `"us"`. */
  separatorStyle?: NumberSeparatorStyle;
}

function groupIntegerDigits(digits: string, groupingBy: NumberGroupingBy): string[] {
  if (groupingBy === "none") {
    return [digits];
  }

  const groups: string[] = [];
  let remaining = digits;

  if (groupingBy === "lakh") {
    if (remaining.length > 3) {
      groups.unshift(remaining.slice(-3));
      remaining = remaining.slice(0, -3);
      while (remaining.length > 2) {
        groups.unshift(remaining.slice(-2));
        remaining = remaining.slice(0, -2);
      }
    }
    if (remaining.length > 0) {
      groups.unshift(remaining);
    }
    return groups;
  }

  const groupSize = groupingBy === "wan" ? 4 : 3;
  while (remaining.length > groupSize) {
    groups.unshift(remaining.slice(-groupSize));
    remaining = remaining.slice(0, -groupSize);
  }
  if (remaining.length > 0) {
    groups.unshift(remaining);
  }
  return groups;
}

function formatNumber(
  value: number,
  roundDecimal: number | false,
  groupingBy: NumberGroupingBy,
  separatorStyle: NumberSeparatorStyle,
): string {
  const thousandsSeparator = separatorStyle === "eu" ? "." : ",";
  const decimalSeparator = separatorStyle === "eu" ? "," : ".";

  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  const fixed =
    roundDecimal === false ? String(absoluteValue) : absoluteValue.toFixed(roundDecimal);
  const [integerPart, decimalPart] = fixed.split(".");

  const groupedInteger = groupIntegerDigits(integerPart, groupingBy).join(thousandsSeparator);
  const formatted = decimalPart
    ? `${groupedInteger}${decimalSeparator}${decimalPart}`
    : groupedInteger;

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats and displays a numeric value with an optional prefix/suffix,
 * decimal rounding, digit grouping, and locale-specific separator style.
 *
 * @example
 * ```tsx
 * <Number value={1234567.891} roundDecimal={2} groupingBy="thousands" separatorStyle="eu" prefix="€" />
 * ```
 */
// biome-ignore lint/suspicious/noShadowRestrictedNames: `Number` is the intended public component name.
export function Number({
  className,
  value,
  prefix,
  suffix,
  roundDecimal = false,
  groupingBy = "none",
  separatorStyle = "us",
  ...rest
}: NumberProps) {
  const formatted = formatNumber(value, roundDecimal, groupingBy, separatorStyle);

  return (
    <span className={cx("eink-number", [className ?? "", !!className])} {...rest}>
      {prefix ? <span className="eink-number__prefix">{prefix}</span> : null}
      <span className="eink-number__value">{formatted}</span>
      {suffix ? <span className="eink-number__suffix">{suffix}</span> : null}
    </span>
  );
}
