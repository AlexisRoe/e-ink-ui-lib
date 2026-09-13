import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../card/card.component";
import { Grid } from "./grid.component";

const meta = {
  title: "Components/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "number" },
    minColumnWidth: { control: "number" },
    gap: { control: "select", options: ["sm", "md", "xl"] },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

function Cell({ label }: { label: string }) {
  return <div style={{ padding: 16, border: "2px solid black", textAlign: "center" }}>{label}</div>;
}

export const Columns: Story = {
  args: { columns: 3, gap: "md" },
  render: (args) => (
    <Grid {...args}>
      <Grid.Item>
        <Cell label="A" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="B" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="C" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="D" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="E" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="F" />
      </Grid.Item>
    </Grid>
  ),
};

export const SpanningItems: Story = {
  name: "Column/row spans",
  args: { columns: 3, gap: "md" },
  render: (args) => (
    <Grid {...args}>
      <Grid.Item colSpan={2}>
        <Cell label="Wide (2 cols)" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="A" />
      </Grid.Item>
      <Grid.Item>
        <Cell label="B" />
      </Grid.Item>
      <Grid.Item rowSpan={2}>
        <Cell label="Tall (2 rows)" />
      </Grid.Item>
      <Grid.Item colSpan={2}>
        <Cell label="Wide again" />
      </Grid.Item>
    </Grid>
  ),
};

export const AutoFitColumns: Story = {
  name: "Auto-fit columns (minColumnWidth)",
  render: () => (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        minWidth: 200,
        maxWidth: "100%",
        width: 600,
        border: "2px dashed black",
        padding: 16,
      }}
    >
      <Grid minColumnWidth={160} gap="md">
        <Grid.Item>
          <Cell label="A" />
        </Grid.Item>
        <Grid.Item>
          <Cell label="B" />
        </Grid.Item>
        <Grid.Item>
          <Cell label="C" />
        </Grid.Item>
        <Grid.Item>
          <Cell label="D" />
        </Grid.Item>
        <Grid.Item>
          <Cell label="E" />
        </Grid.Item>
      </Grid>
    </div>
  ),
};

export const Masonry: Story = {
  render: () => (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        minWidth: 200,
        maxWidth: "100%",
        width: 600,
        border: "2px dashed black",
        padding: 16,
      }}
    >
      <Grid.Masonry minItemWidth={200} gap="md">
        <Card>
          <Card.Content>Short card</Card.Content>
        </Card>
        <Card>
          <Card.Content>
            A card with a lot more content in it, which makes it noticeably taller than its
            neighbors once it wraps onto several lines.
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>Another short one</Card.Content>
        </Card>
        <Card>
          <Card.Content>Medium length content that spans a couple of lines.</Card.Content>
        </Card>
        <Card>
          <Card.Content>Tiny</Card.Content>
        </Card>
        <Card>
          <Card.Content>
            Another tall card with plenty of content to demonstrate the automatic reflow as columns
            are added or removed when the container is resized.
          </Card.Content>
        </Card>
      </Grid.Masonry>
    </div>
  ),
};
