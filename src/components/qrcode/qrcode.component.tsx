import qrcodeGenerator from "qrcode-generator";
import { useMemo } from "react";
import { cx } from "../../utils/cx.utils";
import type { QRCodeValue } from "../../utils/qrcode-payload.utils";
import { buildQRCodePayload } from "../../utils/qrcode-payload.utils";

import "./qrcode.component.css";

/** Error correction level: higher levels survive more damage/occlusion at the cost of a denser code. */
export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

/** Props accepted by {@link QRCode}. */
export interface QRCodeProps {
  /**
   * Content to encode: a plain string, or a structured value (`"url"`,
   * `"wifi"`, `"contact"`, `"email"`, `"phone"`, `"sms"`, `"geo"`, `"totp"`)
   * that is serialized to the appropriate payload format.
   */
  value: string | QRCodeValue;
  /** Caption rendered below the code. */
  label?: string;
  /** Width and height of the rendered code, in pixels. Defaults to `160`. */
  width?: number;
  /**
   * Error correction level, trading code density for damage/occlusion
   * tolerance. Defaults to `"M"`.
   */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  /** Number of empty modules bordering the code. Defaults to `2`. */
  quietZone?: number;
  className?: string;
}

/**
 * QR code rendered as a crisp SVG, styled with the library's design tokens.
 * Accepts either a plain string or a structured {@link QRCodeValue} (Wi-Fi
 * credentials, a contact card, a 2FA `otpauth://` secret, geo coordinates,
 * and more) which is serialized to the correct payload format. An optional
 * `label` caption can be rendered below the code.
 *
 * @example
 * ```tsx
 * <QRCode
 *   value={{ type: "wifi", ssid: "Office", password: "letmein" }}
 *   label="Guest Wi-Fi"
 * />
 * ```
 */
export function QRCode({
  value,
  label,
  width = 160,
  errorCorrectionLevel = "M",
  quietZone = 2,
  className,
}: QRCodeProps) {
  const path = useMemo(() => {
    const payload = buildQRCodePayload(value);
    const code = qrcodeGenerator(0, errorCorrectionLevel);
    code.addData(payload);
    code.make();

    const moduleCount = code.getModuleCount();
    let data = "";
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (code.isDark(row, col)) {
          data += `M${col + quietZone},${row + quietZone}h1v1h-1z`;
        }
      }
    }

    return { data, viewport: moduleCount + quietZone * 2 };
  }, [value, errorCorrectionLevel, quietZone]);

  return (
    <div className={cx("eink-qrcode", [className ?? "", !!className])} style={{ width }}>
      <svg
        className="eink-qrcode__svg"
        viewBox={`0 0 ${path.viewport} ${path.viewport}`}
        role="img"
        aria-label={label ?? "QR code"}
      >
        <rect className="eink-qrcode__background" x={0} y={0} width="100%" height="100%" />
        <path className="eink-qrcode__modules" d={path.data} />
      </svg>
      {label && <p className="eink-qrcode__label">{label}</p>}
    </div>
  );
}
