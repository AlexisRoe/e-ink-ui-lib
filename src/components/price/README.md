---
type: component
title: "Price"
description: "Displays a monetary value with a large integer part and a smaller superscript decimal/currency group, supporting multiple digit-grouping and separator conventions."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/price/price.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Price

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders the integer part large and the decimal part + `currency` string as a smaller superscript group, matching common price-tag typography.
- `value` is always a plain JS number (e.g. `3.99`), never a pre-formatted string; formatting is entirely controlled by `groupingBy`/`separatorStyle`.
- `groupingBy` supports four digit-grouping strategies for the integer part: `"thousands"` (groups of 3), `"lakh"` (Indian numbering: 3 then groups of 2), `"wan"` (East Asian numbering: groups of 4), and `"none"` (no separators). Defaults to `"thousands"`.
- `separatorStyle` supports `"us"` (`,` thousands / `.` decimal, default) and `"eu"` (`.` thousands / `,` decimal).
- Handles negative values by rendering a separate `eink-price__sign` span with `-`.
- Three sizes: `sm`, `md`, `xl` (defaults to `md`), each scaling the integer and superscript font sizes independently via CSS.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging, combining the base/size class (`eink-price eink-price--${size}`) with any consumer-supplied `className`.
- BEM classes prefixed `eink-`: `.eink-price` with `--sm`/`--md`/`--xl` size modifiers, `.eink-price__sign`, `.eink-price__integer`, `.eink-price__superscript`.
- Imports its own `price.component.css` directly.
- Formatting logic (`formatPrice`, `groupIntegerDigits`) is implemented as local pure helper functions inside the component file rather than relying on `Intl.NumberFormat`, since the grouping strategies (lakh, wan) go beyond standard locale formatting.
- Purely presentational — no internal state or context.

---

## Primary Use Cases
- Product price tags/labels in e-commerce or catalog UIs, including large amounts needing regional digit grouping (Indian lakh-style, East Asian wan-style).
- Displaying prices consistently across EU and US separator conventions without needing to pre-format the value string.
- Negative monetary values (e.g. discounts, refunds, balances).

---

## Limits & Restrictions
- `value` must be a plain number in "standard" (American) form — passing a pre-formatted string is not supported; formatting is entirely derived by the component from `separatorStyle`/`groupingBy`.
- Always rounds/pads to exactly two decimal digits via `toFixed(2)`; there is no way to show more or fewer decimal places.
- `currency` is rendered as plain text appended after the decimal digits (inside the superscript group) — there's no separate prop for currency position (prefix vs. suffix) or spacing.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- Size modifier classes (`.eink-price--sm`, `.eink-price--md`, `.eink-price--xl`) independently scale `.eink-price__sign`/`__integer` and `.eink-price__superscript` font sizes using the standard `--eink-size-*` tokens (e.g. `--eink-size-128` for `xl` integers).
- `.eink-price__superscript` sets `font-variant-numeric: tabular-nums` for consistent digit width.

---

## Related Concepts
- `../counter/README.md` — another compact numeric/badge display component using a similar size-scale convention.
- `../last-updated/README.md` — commonly wraps a `Price` value to indicate its freshness.
