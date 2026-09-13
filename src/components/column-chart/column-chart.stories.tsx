import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColumnChart } from "./column-chart.component";

const meta = {
  title: "Components/Data Display/ColumnChart",
  component: ColumnChart,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    unit: { control: "text" },
    withLegend: { control: "boolean" },
    withAxis: { control: "boolean" },
    withLabel: { control: "boolean" },
    referenceLine: { control: "select", options: [undefined, "median", "average"] },
    width: { control: "number" },
    height: { control: "number" },
  },
} satisfies Meta<typeof ColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const categories = ["Jan", "Feb", "Mar", "Apr", "May"];

export const Default: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      categories={categories}
      datasets={[{ label: "2026", data: [40, 52, 61, 48, 33] }]}
    />
  ),
};

export const ThreeDatasets: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      categories={categories}
      datasets={[
        { label: "2024", data: [30, 45, 50, 40, 28] },
        { label: "2025", data: [35, 48, 55, 44, 30] },
        { label: "2026", data: [40, 52, 61, 48, 33] },
      ]}
    />
  ),
};

export const WithReferenceLine: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      referenceLine="average"
      withLegend
      categories={categories}
      datasets={[
        { label: "2025", data: [35, 48, 55, 44, 30] },
        { label: "2026", data: [40, 52, 61, 48, 33] },
      ]}
    />
  ),
};

export const WithLegend: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      withLegend
      categories={categories}
      datasets={[{ label: "2026", data: [40, 52, 61, 48, 33] }]}
    />
  ),
};

export const WithoutAxis: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      withAxis={false}
      categories={categories}
      datasets={[{ label: "2026", data: [40, 52, 61, 48, 33] }]}
    />
  ),
};

export const WithLabel: Story = {
  args: { datasets: [] },
  render: () => (
    <ColumnChart
      title="Rainfall"
      unit="mm"
      withLabel
      categories={categories}
      datasets={[{ label: "2026", data: [40, 52, 61, 48, 33] }]}
    />
  ),
};
