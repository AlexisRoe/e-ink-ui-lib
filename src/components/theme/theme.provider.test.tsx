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
