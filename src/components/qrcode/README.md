---
type: component
title: "QRCode"
description: "QR code rendered as a crisp SVG from a plain string or a structured payload (Wi-Fi, contact, TOTP, etc.), styled with the library's design tokens."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/qrcode/qrcode.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# QRCode

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a QR code as a crisp SVG (`shape-rendering: crispEdges`) built from the `qrcode-generator` package, filled with the library's theme colors rather than hardcoded black/white.
- Accepts either a plain string or a structured `QRCodeValue` (`"url"`, `"wifi"`, `"contact"`, `"email"`, `"phone"`, `"sms"`, `"geo"`, `"totp"`) that is serialized to the correct payload format by `buildQRCodePayload` (`src/utils/qrcode-payload.utils.ts`).
- Configurable `width` (default `160`px), `errorCorrectionLevel` (`"L" | "M" | "Q" | "H"`, default `"M"`, trading code density for damage/occlusion tolerance), and `quietZone` (empty border modules, default `2`).
- Optional `label` caption rendered below the code, and used as the SVG's `aria-label` when provided.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-qrcode`, elements `.eink-qrcode__svg`, `.eink-qrcode__background`, `.eink-qrcode__modules`, `.eink-qrcode__label`.
- Imports its own stylesheet via `import "./qrcode.component.css"`.
- Payload serialization logic is factored out into the framework-agnostic `src/utils/qrcode-payload.utils.ts`, keeping the component focused on rendering.
- Memoizes the generated SVG path data (`useMemo`) keyed on `value`, `errorCorrectionLevel`, and `quietZone` to avoid recomputing the QR matrix on unrelated re-renders.

---

## Primary Use Cases
- Displaying Wi-Fi credentials, contact cards, URLs, or 2FA `otpauth://` secrets as a scannable code on an e-ink device or printed page.
- Embedding a QR code with a caption (e.g. "Guest Wi-Fi") for kiosk, onboarding, or signage screens.

---

## Limits & Restrictions
- `value` is required; there is no default/empty-state rendering.
- The component always renders a single QR code sized to `width` — there is no built-in support for logos overlaid on the code or multi-code layouts.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; colors/spacing/typography come entirely from global theme tokens (`--eink-size-*`, `--eink-color-background`, `--eink-color-primary`, `--eink-font-family-main`).

---

## Related Concepts
- No direct dependencies on other components in `src/components/`; relies on the standalone utility `src/utils/qrcode-payload.utils.ts` for payload construction.
