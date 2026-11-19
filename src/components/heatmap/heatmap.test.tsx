import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Heatmap, type HeatmapCell } from "./heatmap.component";

const columns: HeatmapCell[][] = [
  [
    { id: "d1", level: 0, label: "Day 1" },
    { id: "d2", level: 5, label: "Day 2" },
  ],
  [
    { id: "d3", level: 3, label: "Day 3" },
    { id: "d4", level: 1, label: "Day 4", hidden: true },
  ],
];

describe("Heatmap", () => {
  it("renders cells with level classes and hides hidden cells", () => {
    render(<Heatmap columns={columns} />);
    expect(screen.getByRole("button", { name: "Day 2" })).toHaveClass(
      "eink-heatmap__cell--level-5",
    );
    expect(screen.queryByRole("button", { name: "Day 4" })).not.toBeInTheDocument();
  });

  it("reports selection and marks the selected cell", () => {
    const onSelect = vi.fn();
    render(<Heatmap columns={columns} selectedId="d3" onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: "Day 3" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Day 1" }));
    expect(onSelect).toHaveBeenCalledWith("d1");
  });

  it("renders labels and the legend when provided", () => {
    render(
      <Heatmap
        columns={columns}
        columnLabels={["Nov", null]}
        rowLabels={["Mon", "Tue"]}
        legend={{ less: "Less", more: "More" }}
      />,
    );
    expect(screen.getByText("Nov")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });
});
