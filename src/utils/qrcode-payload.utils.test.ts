import { describe, expect, it } from "vitest";
import { buildQRCodePayload } from "./qrcode-payload.utils";

describe("buildQRCodePayload", () => {
  it("passes plain strings through unchanged", () => {
    expect(buildQRCodePayload("hello")).toBe("hello");
  });

  it("encodes a url value as-is", () => {
    expect(buildQRCodePayload({ type: "url", url: "https://example.com" })).toBe(
      "https://example.com",
    );
  });

  it("encodes a text value as-is", () => {
    expect(buildQRCodePayload({ type: "text", text: "hi there" })).toBe("hi there");
  });

  it("encodes a phone value as a tel link", () => {
    expect(buildQRCodePayload({ type: "phone", number: "+15551234567" })).toBe("tel:+15551234567");
  });

  it("encodes an sms value with a message", () => {
    expect(buildQRCodePayload({ type: "sms", number: "+15551234567", message: "hi" })).toBe(
      "smsto:+15551234567:hi",
    );
  });

  it("encodes an sms value without a message", () => {
    expect(buildQRCodePayload({ type: "sms", number: "+15551234567" })).toBe("smsto:+15551234567:");
  });

  it("encodes an email value with subject and body", () => {
    expect(
      buildQRCodePayload({
        type: "email",
        to: "jane@example.com",
        subject: "Hi",
        body: "Hello there",
      }),
    ).toBe("mailto:jane@example.com?subject=Hi&body=Hello+there");
  });

  it("encodes an email value with no subject/body", () => {
    expect(buildQRCodePayload({ type: "email", to: "jane@example.com" })).toBe(
      "mailto:jane@example.com",
    );
  });

  it("encodes a geo value", () => {
    expect(buildQRCodePayload({ type: "geo", latitude: 52.52, longitude: 13.405 })).toBe(
      "geo:52.52,13.405",
    );
  });

  it("encodes a wifi value with defaults", () => {
    expect(buildQRCodePayload({ type: "wifi", ssid: "MyNet", password: "secret" })).toBe(
      "WIFI:T:WPA;S:MyNet;P:secret;H:false;;",
    );
  });

  it("encodes an open, hidden wifi network", () => {
    expect(
      buildQRCodePayload({ type: "wifi", ssid: "Guest", encryption: "nopass", hidden: true }),
    ).toBe("WIFI:T:nopass;S:Guest;P:;H:true;;");
  });

  it("escapes special characters in wifi fields", () => {
    expect(buildQRCodePayload({ type: "wifi", ssid: "My;Net,work:", password: "a\\b" })).toBe(
      "WIFI:T:WPA;S:My\\;Net\\,work\\:;P:a\\\\b;H:false;;",
    );
  });

  it("encodes a contact value", () => {
    expect(
      buildQRCodePayload({
        type: "contact",
        name: "Jane Doe",
        phone: "+15551234567",
        email: "jane@example.com",
        organization: "Acme",
        url: "https://example.com",
      }),
    ).toBe(
      "MECARD:N:Jane Doe;TEL:+15551234567;EMAIL:jane@example.com;ORG:Acme;URL:https\\://example.com;;",
    );
  });

  it("encodes a contact value with only a name", () => {
    expect(buildQRCodePayload({ type: "contact", name: "Jane Doe" })).toBe("MECARD:N:Jane Doe;;");
  });

  it("encodes a totp value with an issuer", () => {
    const payload = buildQRCodePayload({
      type: "totp",
      secret: "JBSWY3DPEHPK3PXP",
      accountName: "jane@example.com",
      issuer: "Acme",
    });
    expect(payload).toBe(
      "otpauth://totp/Acme:jane%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Acme&algorithm=SHA1&digits=6&period=30",
    );
  });

  it("encodes a totp value without an issuer, using custom algorithm/digits/period", () => {
    const payload = buildQRCodePayload({
      type: "totp",
      secret: "JBSWY3DPEHPK3PXP",
      accountName: "jane@example.com",
      algorithm: "SHA256",
      digits: 8,
      period: 60,
    });
    expect(payload).toBe(
      "otpauth://totp/jane%40example.com?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256&digits=8&period=60",
    );
  });
});
