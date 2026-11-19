import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Heatmap, type HeatmapCell, type HeatmapLevel } from "./heatmap.component";

const WEEKS = 8;
const DAYS = 7;
const LEVELS = 6;

const columns: HeatmapCell[][] = Array.from({ length: WEEKS }, (_, week) =>
  Array.from({ length: DAYS }, (_, day) => {
    const index = week * DAYS + day;
    return {
      id: `d${index}`,
      level: ((index * 5) % LEVELS) as HeatmapLevel,
      label: `Day ${index + 1}`,
    };
  }),
);

const columnLabels = columns.map((_, week) => (week % 2 === 0 ? `W${week + 1}` : null));
const rowLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

const meta = {
  title: "Components/Data Display/Heatmap",
  component: Heatmap,
  tags: ["autodocs"],
  args: { columns },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabelsAndLegend: Story = {
  args: { columnLabels, rowLabels, legend: { less: "Less", more: "More" } },
};

function SelectableHeatmap() {
  const [selectedId, setSelectedId] = useState<string | null>("d10");
  return (
    <Heatmap
      columns={columns}
      columnLabels={columnLabels}
      rowLabels={rowLabels}
      selectedId={selectedId}
      onSelect={setSelectedId}
      legend={{ less: "Less", more: "More" }}
    />
  );
}

export const Selectable: Story = {
  render: () => <SelectableHeatmap />,
};
