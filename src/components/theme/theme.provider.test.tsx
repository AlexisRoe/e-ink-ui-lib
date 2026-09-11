import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "./theme.provider";

describe("ThemeProvider", () => {
  it("renders its children", () => {
    render(
      <ThemeProvider>
        <p>Child content</p>
      </ThemeProvider>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("exposes themeApplied as true", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.themeApplied).toBe(true);
  });
});

describe("useTheme", () => {
  it("throws when used outside of a ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });
});

describe("cx", () => {
  it("returns only the base class when there are no conditions", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.cx("eink-button")).toBe("eink-button");
  });

  it("omits the base class when it is undefined", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.cx(undefined, ["eink-button--pressed", true])).toBe(
      "eink-button--pressed",
    );
  });

  it("appends a single conditional class when its condition is true", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.cx("eink-button", ["eink-button--pressed", true])).toBe(
      "eink-button eink-button--pressed",
    );
  });

  it("omits a conditional class when its condition is false", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.cx("eink-button", ["eink-button--pressed", false])).toBe("eink-button");
  });

  it("supports multiple conditional classes, keeping only the true ones", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(
      result.current.cx(
        "eink-button",
        ["eink-button--pressed", true],
        ["eink-button--disabled", false],
        ["eink-button--loading", true],
      ),
    ).toBe("eink-button eink-button--pressed eink-button--loading");
  });

  it("returns an empty string when nothing applies", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.cx(undefined, ["eink-button--pressed", false])).toBe("");
  });
});
