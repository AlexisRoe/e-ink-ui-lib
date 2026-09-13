import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./line-chart.component";

const meta = {
  title: "Components/Data Display/LineChart",
  component: LineChart,
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
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const Default: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      categories={categories}
      datasets={[{ label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] }]}
    />
  ),
};

export const ThreeDatasets: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      categories={categories}
      datasets={[
        { label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] },
        { label: "Device B", data: [60, 62, 65, 64, 67, 70, 72] },
        { label: "Device C", data: [90, 85, 80, 78, 75, 74, 70] },
      ]}
    />
  ),
};

export const WithReferenceLine: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      referenceLine="average"
      withLegend
      categories={categories}
      datasets={[
        { label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] },
        { label: "Device B", data: [60, 62, 65, 64, 67, 70, 72] },
      ]}
    />
  ),
};

export const WithLegend: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      withLegend
      categories={categories}
      datasets={[{ label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] }]}
    />
  ),
};

export const WithoutAxis: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      withAxis={false}
      categories={categories}
      datasets={[{ label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] }]}
    />
  ),
};

export const WithLabel: Story = {
  args: { datasets: [] },
  render: () => (
    <LineChart
      title="Battery level"
      unit="%"
      withLabel
      categories={categories}
      datasets={[{ label: "Device A", data: [82, 79, 76, 74, 70, 68, 65] }]}
    />
  ),
};
