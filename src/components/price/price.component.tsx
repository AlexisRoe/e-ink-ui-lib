import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./price.component.css";

/** Sizes accepted by {@link Price}. Defaults to `"md"`. */
export type PriceSize = "sm" | "md" | "xl";

/**
 * Digit grouping strategy applied to the integer part of the value.
 * - `"thousands"` — groups of 3 digits (e.g. `1,000,000`).
 * - `"lakh"` — Indian numbering system: 3 digits, then groups of 2 (e.g. `10,00,000`).
 * - `"wan"` — East Asian numbering system: groups of 4 digits (e.g. `1,0000,0000`).
 * - `"none"` — no grouping separators.
 */
export type PriceGroupingBy = "thousands" | "lakh" | "wan" | "none";

/**
 * Which characters are used as the thousands and decimal separators.
 * - `"eu"` — `.` for thousands, `,` for decimals (e.g. `1.234,56`).
 * - `"us"` — `,` for thousands, `.` for decimals (e.g. `1,234.56`).
 */
export type PriceSeparatorStyle = "eu" | "us";

/** Props accepted by {@link Price}. */
export interface PriceProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * The price to display, provided as a standard (American-formatted) JS
   * number, e.g. `3.99` — never a pre-formatted string. The `separatorStyle`
   * prop controls how this value is rendered, independent of how it's passed.
   */
  value: number;
  /** Currency symbol or code rendered alongside the decimal part, e.g. `"€"` or `"USD"`. */
  currency: string;
  /** Size of the price. Defaults to `"md"`. */
  size?: PriceSize;
  /** Digit grouping strategy for the integer part. Defaults to `"thousands"`. */
  groupingBy?: PriceGroupingBy;
  /** Thousands/decimal separator characters to use. Defaults to `"us"`. */
  separatorStyle?: PriceSeparatorStyle;
}

function groupIntegerDigits(digits: string, groupingBy: PriceGroupingBy): string[] {
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

interface FormattedPrice {
  sign: string;
  integerPart: string;
  decimalPart: string;
}

function formatPrice(
  value: number,
  groupingBy: PriceGroupingBy,
  separatorStyle: PriceSeparatorStyle,
): FormattedPrice {
  const thousandsSeparator = separatorStyle === "eu" ? "." : ",";

  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  const [integerDigits, decimalDigits] = absoluteValue.toFixed(2).split(".");

  const groupedInteger = groupIntegerDigits(integerDigits, groupingBy).join(thousandsSeparator);

  return {
    sign: isNegative ? "-" : "",
    integerPart: groupedInteger,
    decimalPart: decimalDigits,
  };
}

/**
 * Displays a monetary value with the integer part rendered large and the
 * decimal part and currency symbol rendered as a smaller superscript group,
 * matching common price-tag typography. Supports digit grouping (thousands,
 * lakh, wan) and eu/us separator styles for large amounts.
 *
 * @example
 * ```tsx
 * <Price value={3.99} currency="€" separatorStyle="eu" />
 * <Price value={1234567.5} currency="$" size="xl" />
 * ```
 */
export function Price({
  className,
  value,
  currency,
  size = "md",
  groupingBy = "thousands",
  separatorStyle = "us",
  ...rest
}: PriceProps) {
  const decimalSeparator = separatorStyle === "eu" ? "," : ".";
  const { sign, integerPart, decimalPart } = formatPrice(value, groupingBy, separatorStyle);

  return (
    <span
      className={cx(`eink-price eink-price--${size}`, [className ?? "", !!className])}
      {...rest}
    >
      {sign ? <span className="eink-price__sign">{sign}</span> : null}
      <span className="eink-price__integer">{integerPart}</span>
      <span className="eink-price__superscript">
        {decimalSeparator}
        {decimalPart}
        {currency}
      </span>
    </span>
  );
}
