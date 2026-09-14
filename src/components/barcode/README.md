---
type: component
title: "Barcode"
description: "Renders a 1D barcode as an SVG using jsbarcode, supporting multiple symbologies and an optional caption."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/barcode/barcode.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Barcode

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Encodes a `value` string as an SVG barcode via the `jsbarcode` library
- Supports multiple symbologies through `format`: `code128` (default), `code39`, `ean13`, `ean8`, `upc`, `itf14`, `msi`, `pharmacode`, `codabar`
- Optional `label` caption rendered below the barcode, separate from the encoded value text
- `withValue` toggles whether the encoded value text is displayed under the bars (default `true`)
- Configurable render `width` in pixels (default `240`); height scales to preserve the symbology's aspect ratio
- Renders an inline error message with `role="alert"` if the value cannot be encoded for the chosen format (e.g. wrong length/checksum)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to conditionally apply the optional `className`
- BEM classes prefixed `eink-`: `.eink-barcode`, `.eink-barcode__svg`, `.eink-barcode__label`, `.eink-barcode__error`
- Imports its own `barcode.component.css`
- Barcode generation happens in a `useEffect` that re-runs on `value`/`format`/`withValue` changes, drawing into an SVG ref via `JsBarcode`
- Accessible: sets `role="img"` and `aria-label` (from `label` or `value`) on the SVG, and `role="alert"` on the error message

---

## Primary Use Cases
- Displaying product barcodes (retail EAN13/EAN8/UPC) on receipts, labels, or inventory screens
- Logistics/shipping labels using ITF14 or Code39
- General-purpose encoding of arbitrary text (SKUs, order IDs) via Code128

---

## Limits & Restrictions
- `value` must satisfy the checksum/length rules of the chosen `format` (e.g. 12 or 13 digits for `ean13`); otherwise an inline error is shown instead of a barcode
- Requires `value` as a required prop; all other props are optional with defaults
- Rendering is entirely client-side via the `jsbarcode` dependency — no server-side rendering fallback is provided beyond the error message

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; `barcode.component.css` only consumes global theme tokens (`--eink-size-*`, `--eink-color-*`, `--eink-border-width-thin`, `--eink-font-family-main`)
- `.eink-barcode__svg` sets `shape-rendering: crispEdges` to keep bars sharp on e-ink displays

---

## Related Concepts
- None directly related within `src/components/`; `Barcode` is a standalone data-display component
