import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTheme } from "../components/theme/theme.provider";
import { renderWithProviders, stubMatchMedia } from "./index";

function Probe() {
  return <p>{useTheme().themeApplied ? "themed" : "plain"}</p>;
}

describe("testing helpers", () => {
  it("stubMatchMedia lets tests choose matching queries", () => {
    stubMatchMedia((query) => query === "(max-width: 767px)");
    expect(window.matchMedia("(max-width: 767px)").matches).toBe(true);
    expect(window.matchMedia("(min-width: 1px)").matches).toBe(false);
  });

  it("renderWithProviders wraps the UI in EinkProvider", () => {
    renderWithProviders(<Probe />);
    expect(screen.getByText("themed")).toBeInTheDocument();
  });
});
