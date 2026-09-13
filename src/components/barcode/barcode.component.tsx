import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";

import { cx } from "../../utils/cx.utils";

import "./barcode.component.css";

/**
 * 1D barcode symbology to encode `value` as. Covers retail (`"ean13"`,
 * `"ean8"`, `"upc"`), logistics (`"itf14"`, `"code39"`), and general-purpose
 * (`"code128"`) use cases.
 */
export type BarcodeFormat =
  | "code128"
  | "code39"
  | "ean13"
  | "ean8"
  | "upc"
  | "itf14"
  | "msi"
  | "pharmacode"
  | "codabar";

/** Props accepted by {@link Barcode}. */
export interface BarcodeProps {
  /** Data to encode. Must satisfy the checksum/length rules of `format` (e.g. 12 or 13 digits for `"ean13"`). */
  value: string;
  /** Barcode symbology. Defaults to `"code128"`, which accepts any text. */
  format?: BarcodeFormat;
  /** Caption rendered below the barcode, separate from the encoded value shown under the bars. */
  label?: string;
  /** Width of the rendered barcode, in pixels. Height scales to preserve the symbology's natural aspect ratio. Defaults to `240`. */
  width?: number;
  /** Whether the encoded value is rendered as text under the bars. Defaults to `true`. */
  withValue?: boolean;
  className?: string;
}

/**
 * 1D barcode rendered as an SVG, styled with the library's design tokens.
 * Supports multiple symbologies via `format`; an optional `label` caption
 * can be rendered below, separate from the encoded value text.
 *
 * @example
 * ```tsx
 * <Barcode value="036000291452" format="ean13" label="Cereal, 500g" />
 * ```
 */
export function Barcode({
  value,
  format = "code128",
  label,
  width = 240,
  withValue = true,
  className,
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    try {
      JsBarcode(svgRef.current, value, {
        format,
        displayValue: withValue,
        margin: 0,
      });
      setError(null);
    } catch {
      setError(`Unable to encode "${value}" as ${format}.`);
    }
  }, [value, format, withValue]);

  return (
    <div className={cx("eink-barcode", [className ?? "", !!className])} style={{ width }}>
      {error ? (
        <p className="eink-barcode__error" role="alert">
          {error}
        </p>
      ) : (
        <svg className="eink-barcode__svg" ref={svgRef} role="img" aria-label={label ?? value} />
      )}
      {label && <p className="eink-barcode__label">{label}</p>}
    </div>
  );
}
