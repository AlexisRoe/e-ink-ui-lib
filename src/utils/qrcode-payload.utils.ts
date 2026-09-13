/** Wi-Fi network credentials, encoded as a `WIFI:` payload. */
export interface QRCodeWifiValue {
  type: "wifi";
  /** Network name (SSID). */
  ssid: string;
  /** Network password. Omit for open networks. */
  password?: string;
  /** Security protocol. Defaults to `"WPA"`. */
  encryption?: "WPA" | "WEP" | "nopass";
  /** Whether the network is hidden. Defaults to `false`. */
  hidden?: boolean;
}

/** Contact card, encoded as a minimal `MECARD:` payload. */
export interface QRCodeContactValue {
  type: "contact";
  /** Full name. */
  name: string;
  /** Phone number. */
  phone?: string;
  /** Email address. */
  email?: string;
  /** Organization / company name. */
  organization?: string;
  /** Website URL. */
  url?: string;
}

/** Web address, encoded as-is. */
export interface QRCodeUrlValue {
  type: "url";
  url: string;
}

/** Plain text, encoded as-is. */
export interface QRCodeTextValue {
  type: "text";
  text: string;
}

/** Phone number, encoded as a `tel:` link. */
export interface QRCodePhoneValue {
  type: "phone";
  number: string;
}

/** Pre-filled SMS, encoded as an `sms:` link. */
export interface QRCodeSmsValue {
  type: "sms";
  number: string;
  message?: string;
}

/** Pre-filled email, encoded as a `mailto:` link. */
export interface QRCodeEmailValue {
  type: "email";
  to: string;
  subject?: string;
  body?: string;
}

/** Geographic coordinates, encoded as a `geo:` link. */
export interface QRCodeGeoValue {
  type: "geo";
  latitude: number;
  longitude: number;
}

/** Two-factor authentication secret, encoded as an `otpauth://` link. */
export interface QRCodeTotpValue {
  type: "totp";
  /** Base32-encoded shared secret. */
  secret: string;
  /** Account identifier shown in authenticator apps (e.g. `"jane@example.com"`). */
  accountName: string;
  /** Issuing service name (e.g. `"Acme"`). */
  issuer?: string;
  /** HMAC algorithm. Defaults to `"SHA1"`. */
  algorithm?: "SHA1" | "SHA256" | "SHA512";
  /** Number of digits in the generated code. Defaults to `6`. */
  digits?: 6 | 8;
  /** Validity period in seconds. Defaults to `30`. */
  period?: number;
}

/** Structured content a {@link QRCode} can encode, in addition to a plain string. */
export type QRCodeValue =
  | QRCodeUrlValue
  | QRCodeTextValue
  | QRCodeWifiValue
  | QRCodeContactValue
  | QRCodePhoneValue
  | QRCodeSmsValue
  | QRCodeEmailValue
  | QRCodeGeoValue
  | QRCodeTotpValue;

function escapeMecard(value: string): string {
  return value.replace(/([\\;,:])/g, "\\$1");
}

/** Serializes a {@link QRCodeValue} (or plain string) to the text a QR code should encode. */
export function buildQRCodePayload(value: string | QRCodeValue): string {
  if (typeof value === "string") {
    return value;
  }

  switch (value.type) {
    case "url":
      return value.url;
    case "text":
      return value.text;
    case "phone":
      return `tel:${value.number}`;
    case "sms":
      return `smsto:${value.number}:${value.message ?? ""}`;
    case "email": {
      const params = new URLSearchParams();
      if (value.subject) params.set("subject", value.subject);
      if (value.body) params.set("body", value.body);
      const query = params.toString();
      return `mailto:${value.to}${query ? `?${query}` : ""}`;
    }
    case "geo":
      return `geo:${value.latitude},${value.longitude}`;
    case "wifi": {
      const encryption = value.encryption ?? "WPA";
      const password = value.password ?? "";
      return `WIFI:T:${encryption};S:${escapeMecard(value.ssid)};P:${escapeMecard(password)};H:${value.hidden ? "true" : "false"};;`;
    }
    case "contact": {
      const parts = [`N:${escapeMecard(value.name)}`];
      if (value.phone) parts.push(`TEL:${escapeMecard(value.phone)}`);
      if (value.email) parts.push(`EMAIL:${escapeMecard(value.email)}`);
      if (value.organization) parts.push(`ORG:${escapeMecard(value.organization)}`);
      if (value.url) parts.push(`URL:${escapeMecard(value.url)}`);
      return `MECARD:${parts.join(";")};;`;
    }
    case "totp": {
      const params = new URLSearchParams({ secret: value.secret });
      if (value.issuer) params.set("issuer", value.issuer);
      params.set("algorithm", value.algorithm ?? "SHA1");
      params.set("digits", String(value.digits ?? 6));
      params.set("period", String(value.period ?? 30));
      const label = value.issuer
        ? `${encodeURIComponent(value.issuer)}:${encodeURIComponent(value.accountName)}`
        : encodeURIComponent(value.accountName);
      return `otpauth://totp/${label}?${params.toString()}`;
    }
    default: {
      const exhaustive: never = value;
      throw new Error(`Unsupported QR code value: ${JSON.stringify(exhaustive)}`);
    }
  }
}
