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

  it("renders category labels", () => {
    const { getByText } = render(<ColumnChart datasets={datasets} categories={["Jan", "Feb"]} />);
    expect(getByText("Jan")).toBeInTheDocument();
    expect(getByText("Feb")).toBeInTheDocument();
  });

  it("renders a legend by default", () => {
    const { getByText } = render(<ColumnChart datasets={datasets} />);
    expect(getByText("2025")).toBeInTheDocument();
  });

  it("hides the legend when withLegend is false", () => {
    const { queryByText } = render(<ColumnChart datasets={datasets} withLegend={false} />);
    expect(queryByText("2025")).not.toBeInTheDocument();
  });

  it("renders a reference line when requested", () => {
    const { container, getByText } = render(
      <ColumnChart datasets={datasets} referenceLine="average" />,
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
      <ColumnChart datasets={datasets} categories={["Jan", "Feb"]} withAxis={false} />,
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
