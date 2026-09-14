import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { usePreferredLanguage } from "./use-preferred-language.hook";

describe("usePreferredLanguage", () => {
  afterEach(() => {
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("returns navigator.language", () => {
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
    const { result } = renderHook(() => usePreferredLanguage());
    expect(result.current).toBe("en-US");
  });

  it("updates when the languagechange event fires", () => {
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
    const { result } = renderHook(() => usePreferredLanguage());

    act(() => {
      Object.defineProperty(navigator, "language", { value: "de-DE", configurable: true });
      window.dispatchEvent(new Event("languagechange"));
    });

    expect(result.current).toBe("de-DE");
  });
});
