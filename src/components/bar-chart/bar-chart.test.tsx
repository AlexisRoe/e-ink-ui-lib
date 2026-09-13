import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./bar-chart.component";

const datasets = [
  { label: "Shift A", data: [10, 20] },
  { label: "Shift B", data: [15, 25] },
];

describe("BarChart", () => {
  it("renders a bar per dataset value", () => {
    const { container } = render(<BarChart datasets={datasets} />);
    expect(container.querySelectorAll("rect.eink-bar-chart__bar")).toHaveLength(4);
  });

  it("ignores datasets beyond the third", () => {
    const { container } = render(
      <BarChart
        datasets={[
          { label: "A", data: [1] },
          { label: "B", data: [2] },
          { label: "C", data: [3] },
          { label: "D", data: [4] },
        ]}
      />,
    );
    expect(container.querySelectorAll("rect.eink-bar-chart__bar")).toHaveLength(3);
  });

  it("renders the title with unit", () => {
    const { getByText } = render(<BarChart datasets={datasets} title="Throughput" unit="u/h" />);
    expect(getByText("Throughput - u/h")).toBeInTheDocument();
  });

  it("hides category labels by default", () => {
    const { queryByText } = render(
      <BarChart datasets={datasets} categories={["Line 1", "Line 2"]} />,
    );
    expect(queryByText("Line 1")).not.toBeInTheDocument();
    expect(queryByText("Line 2")).not.toBeInTheDocument();
  });

  it("renders category labels when withLabel is true", () => {
    const { getByText } = render(
      <BarChart datasets={datasets} categories={["Line 1", "Line 2"]} withLabel />,
    );
    expect(getByText("Line 1")).toBeInTheDocument();
    expect(getByText("Line 2")).toBeInTheDocument();
  });

  it("hides the legend by default", () => {
    const { queryByText } = render(<BarChart datasets={datasets} />);
    expect(queryByText("Shift A")).not.toBeInTheDocument();
  });

  it("renders the legend when withLegend is true", () => {
    const { getByText } = render(<BarChart datasets={datasets} withLegend />);
    expect(getByText("Shift A")).toBeInTheDocument();
  });

  it("renders a reference line when requested", () => {
    const { container, getByText } = render(
      <BarChart datasets={datasets} referenceLine="median" withLegend />,
    );
    expect(container.querySelector(".eink-bar-chart__reference")).toBeInTheDocument();
    expect(getByText("Median")).toBeInTheDocument();
  });

  it("renders the axis by default", () => {
    const { container } = render(<BarChart datasets={datasets} />);
    expect(container.querySelector(".eink-bar-chart__axis")).toBeInTheDocument();
  });

  it("hides the axis when withAxis is false", () => {
    const { container } = render(<BarChart datasets={datasets} withAxis={false} />);
    expect(container.querySelector(".eink-bar-chart__axis")).not.toBeInTheDocument();
  });

  it("keeps the axis but hides category labels when withLabel is false", () => {
    const { container, queryByText } = render(
      <BarChart datasets={datasets} categories={["Line 1", "Line 2"]} withLabel={false} />,
    );
    expect(container.querySelector(".eink-bar-chart__axis")).toBeInTheDocument();
    expect(queryByText("Line 1")).not.toBeInTheDocument();
  });
});
