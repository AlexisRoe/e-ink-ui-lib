import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./bar-chart.component";

const meta = {
  title: "Components/Data Display/BarChart",
  component: BarChart,
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
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const categories = ["Line 1", "Line 2", "Line 3", "Line 4"];

export const Default: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      categories={categories}
      datasets={[{ label: "Shift A", data: [120, 98, 140, 110] }]}
    />
  ),
};

export const ThreeDatasets: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      categories={categories}
      datasets={[
        { label: "Shift A", data: [120, 98, 140, 110] },
        { label: "Shift B", data: [100, 105, 130, 95] },
        { label: "Shift C", data: [90, 88, 115, 100] },
      ]}
    />
  ),
};

export const WithReferenceLine: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      referenceLine="median"
      categories={categories}
      datasets={[
        { label: "Shift A", data: [120, 98, 140, 110] },
        { label: "Shift B", data: [100, 105, 130, 95] },
      ]}
    />
  ),
};

export const WithoutLegend: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      withLegend={false}
      categories={categories}
      datasets={[{ label: "Shift A", data: [120, 98, 140, 110] }]}
    />
  ),
};

export const WithoutAxis: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      withAxis={false}
      categories={categories}
      datasets={[{ label: "Shift A", data: [120, 98, 140, 110] }]}
    />
  ),
};

export const WithoutLabel: Story = {
  args: { datasets: [] },
  render: () => (
    <BarChart
      title="Throughput"
      unit="units/h"
      withLabel={false}
      categories={categories}
      datasets={[{ label: "Shift A", data: [120, 98, 140, 110] }]}
    />
  ),
};
