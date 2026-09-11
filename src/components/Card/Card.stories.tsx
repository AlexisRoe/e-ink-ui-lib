import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Annual report</Card.Title>
        <Card.Subtitle>Finance · 2026</Card.Subtitle>
      </Card.Header>
      <Card.Content>Full year results are now available for download.</Card.Content>
    </Card>
  ),
};

export const Bare: Story = {
  render: (args) => (
    <Card {...args}>
      <p>Anything can go directly inside a bare card — no header or content required.</p>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Content>A card without a header.</Card.Content>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Annual report</Card.Title>
        <Card.Subtitle>Finance · 2026</Card.Subtitle>
      </Card.Header>
    </Card>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Annual report</Card.Title>
        <Card.Subtitle>Finance · 2026</Card.Subtitle>
        <Card.Action iconLeft="download" onClick={() => alert("Downloading...")}>
          Download
        </Card.Action>
      </Card.Header>
      <Card.Content>Full year results are now available for download.</Card.Content>
    </Card>
  ),
};

export const WithRibbon: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Ribbon>New</Card.Ribbon>
      <Card.Header>
        <Card.Title>Featured article</Card.Title>
        <Card.Subtitle>Design system</Card.Subtitle>
      </Card.Header>
    </Card>
  ),
};
