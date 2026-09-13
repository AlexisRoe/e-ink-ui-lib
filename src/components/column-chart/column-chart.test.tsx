import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColumnChart } from "./column-chart.component";

const datasets = [
  { label: "2025", data: [10, 20] },
  { label: "2026", data: [15, 25] },
];

describe("ColumnChart", () => {
  it("renders a column per dataset value", () => {
    const { container } = render(<ColumnChart datasets={datasets} />);
    expect(container.querySelectorAll("rect.eink-column-chart__bar")).toHaveLength(4);
  });

  it("ignores datasets beyond the third", () => {
    const { container } = render(
      <ColumnChart
        datasets={[
          { label: "A", data: [1] },
          { label: "B", data: [2] },
          { label: "C", data: [3] },
          { label: "D", data: [4] },
        ]}
      />,
    );
    expect(container.querySelectorAll("rect.eink-column-chart__bar")).toHaveLength(3);
  });

  it("renders the title with unit", () => {
    const { getByText } = render(<ColumnChart datasets={datasets} title="Rainfall" unit="mm" />);
    expect(getByText("Rainfall - mm")).toBeInTheDocument();
  });

  it("hides category labels by default", () => {
    const { queryByText } = render(<ColumnChart datasets={datasets} categories={["Jan", "Feb"]} />);
    expect(queryByText("Jan")).not.toBeInTheDocument();
    expect(queryByText("Feb")).not.toBeInTheDocument();
  });

  it("renders category labels when withLabel is true", () => {
    const { getByText } = render(
      <ColumnChart datasets={datasets} categories={["Jan", "Feb"]} withLabel />,
    );
    expect(getByText("Jan")).toBeInTheDocument();
    expect(getByText("Feb")).toBeInTheDocument();
  });

  it("hides the legend by default", () => {
    const { queryByText } = render(<ColumnChart datasets={datasets} />);
    expect(queryByText("2025")).not.toBeInTheDocument();
  });

  it("renders the legend when withLegend is true", () => {
    const { getByText } = render(<ColumnChart datasets={datasets} withLegend />);
    expect(getByText("2025")).toBeInTheDocument();
  });

  it("renders a reference line when requested", () => {
    const { container, getByText } = render(
      <ColumnChart datasets={datasets} referenceLine="average" withLegend />,
    );
    expect(container.querySelector(".eink-column-chart__reference")).toBeInTheDocument();
    expect(getByText("Average")).toBeInTheDocument();
  });

  it("renders the axis by default", () => {
    const { container } = render(<ColumnChart datasets={datasets} />);
    expect(container.querySelector(".eink-column-chart__axis")).toBeInTheDocument();
  });

  it("hides the axis and category labels when withAxis is false", () => {
    const { container, queryByText } = render(
      <ColumnChart datasets={datasets} categories={["Jan", "Feb"]} withLabel withAxis={false} />,
    );
    expect(container.querySelector(".eink-column-chart__axis")).not.toBeInTheDocument();
    expect(queryByText("Jan")).not.toBeInTheDocument();
  });

  it("keeps the axis but hides category labels when withLabel is false", () => {
    const { container, queryByText } = render(
      <ColumnChart datasets={datasets} categories={["Jan", "Feb"]} withLabel={false} />,
    );
    expect(container.querySelector(".eink-column-chart__axis")).toBeInTheDocument();
    expect(queryByText("Jan")).not.toBeInTheDocument();
  });
});
