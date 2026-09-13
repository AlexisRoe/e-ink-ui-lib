import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Segmented } from "./segmented.component";

function renderSegmented(props: Partial<React.ComponentProps<typeof Segmented>> = {}) {
  return render(
    <Segmented {...props}>
      <Segmented.Item id="day">Day</Segmented.Item>
      <Segmented.Item id="week">Week</Segmented.Item>
      <Segmented.Item id="month">Month</Segmented.Item>
      <Segmented.Item id="year">Year</Segmented.Item>
    </Segmented>,
  );
}

describe("Segmented", () => {
  it("renders each item as a button", () => {
    renderSegmented();
    expect(screen.getByText("Day").tagName).toBe("BUTTON");
    expect(screen.getByText("Year").tagName).toBe("BUTTON");
  });

  it("highlights the item matching defaultId", () => {
    renderSegmented({ defaultId: "year" });
    expect(screen.getByText("Year")).toHaveClass("eink-segmented__item--selected");
    expect(screen.getByText("Day")).not.toHaveClass("eink-segmented__item--selected");
  });

  it("has no selected item when defaultId is omitted", () => {
    renderSegmented();
    for (const label of ["Day", "Week", "Month", "Year"]) {
      expect(screen.getByText(label)).not.toHaveClass("eink-segmented__item--selected");
    }
  });

  it("selects a segment on click and calls onChange with its id", () => {
    const onChange = vi.fn();
    renderSegmented({ onChange });

    fireEvent.click(screen.getByText("Month"));

    expect(onChange).toHaveBeenCalledWith("month");
    expect(screen.getByText("Month")).toHaveClass("eink-segmented__item--selected");
  });

  it("only keeps one segment selected at a time", () => {
    renderSegmented({ defaultId: "day" });

    fireEvent.click(screen.getByText("Week"));

    expect(screen.getByText("Day")).not.toHaveClass("eink-segmented__item--selected");
    expect(screen.getByText("Week")).toHaveClass("eink-segmented__item--selected");
  });

  it("applies the full-width class when fullWidth is true", () => {
    renderSegmented({ fullWidth: true });
    expect(document.querySelector(".eink-segmented")).toHaveClass("eink-segmented--full-width");
  });

  it("does not apply the full-width class by default", () => {
    renderSegmented();
    expect(document.querySelector(".eink-segmented")).not.toHaveClass("eink-segmented--full-width");
  });
});
