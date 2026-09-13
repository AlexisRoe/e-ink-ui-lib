import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LineChart } from "./line-chart.component";

const datasets = [
  { label: "Device A", data: [1, 2, 3] },
  { label: "Device B", data: [3, 2, 1] },
];

describe("LineChart", () => {
  it("renders a polyline per dataset", () => {
    const { container } = render(<LineChart datasets={datasets} />);
    expect(container.querySelectorAll("polyline")).toHaveLength(2);
  });

  it("ignores datasets beyond the third", () => {
    const { container } = render(
      <LineChart
        datasets={[
          { label: "A", data: [1] },
          { label: "B", data: [2] },
          { label: "C", data: [3] },
          { label: "D", data: [4] },
        ]}
      />,
    );
    expect(container.querySelectorAll("polyline")).toHaveLength(3);
  });

  it("renders the title with unit", () => {
    const { getByText } = render(<LineChart datasets={datasets} title="Battery" unit="%" />);
    expect(getByText("Battery - %")).toBeInTheDocument();
  });

  it("renders the title without unit", () => {
    const { getByText } = render(<LineChart datasets={datasets} title="Battery" />);
    expect(getByText("Battery")).toBeInTheDocument();
  });

  it("hides the legend by default", () => {
    const { queryByText } = render(<LineChart datasets={datasets} />);
    expect(queryByText("Device A")).not.toBeInTheDocument();
  });

  it("renders the legend when withLegend is true", () => {
    const { getByText } = render(<LineChart datasets={datasets} withLegend />);
    expect(getByText("Device A")).toBeInTheDocument();
    expect(getByText("Device B")).toBeInTheDocument();
  });

  it("renders a reference line and legend entry when requested", () => {
    const { container, getByText } = render(
      <LineChart datasets={datasets} referenceLine="average" withLegend />,
    );
    expect(container.querySelector(".eink-line-chart__reference")).toBeInTheDocument();
    expect(getByText("Average")).toBeInTheDocument();
  });

  it("omits the reference line by default", () => {
    const { container } = render(<LineChart datasets={datasets} />);
    expect(container.querySelector(".eink-line-chart__reference")).not.toBeInTheDocument();
  });

  it("renders the axis by default", () => {
    const { container } = render(<LineChart datasets={datasets} />);
    expect(container.querySelector(".eink-line-chart__axis")).toBeInTheDocument();
  });

  it("hides the axis when withAxis is false", () => {
    const { container } = render(<LineChart datasets={datasets} withAxis={false} />);
    expect(container.querySelector(".eink-line-chart__axis")).not.toBeInTheDocument();
  });

  it("hides category labels by default", () => {
    const { container, queryByText } = render(
      <LineChart datasets={datasets} categories={["Mon", "Tue", "Wed"]} />,
    );
    expect(container.querySelector(".eink-line-chart__axis")).toBeInTheDocument();
    expect(queryByText("Mon")).not.toBeInTheDocument();
  });

  it("renders category labels when withLabel is true", () => {
    const { getByText } = render(
      <LineChart datasets={datasets} categories={["Mon", "Tue", "Wed"]} withLabel />,
    );
    expect(getByText("Mon")).toBeInTheDocument();
  });

  it("scales the y-axis to the data range, not forced through 0", () => {
    const { container } = render(
      <LineChart datasets={[{ label: "Device A", data: [80, 70] }]} width={100} height={100} />,
    );
    const points = container.querySelector("polyline")?.getAttribute("points") ?? "";
    const ys = points.split(" ").map((point) => Number(point.split(",")[1]));
    expect(Math.min(...ys)).toBeCloseTo(16);
    expect(Math.max(...ys)).toBeCloseTo(100 - 28);
  });
});
