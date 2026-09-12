import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code } from "./code.component";

const jsSample = `function greet(name) {
  if (!name) {
    return "Hello, stranger!";
  }

  return \`Hello, \${name}!\`;
}`;

const htmlSample = `<ul class="list">
  <li>
    <a href="/about">About</a>
  </li>
  <li>
    <a href="/contact">Contact</a>
  </li>
</ul>`;

const meta = {
  title: "Components/Typography/Code",
  component: Code,
  tags: ["autodocs"],
  args: {
    children: "npm install",
  },
  argTypes: {
    mono: {
      control: "boolean",
      description: "When true, renders a black background with white text.",
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mono: Story = {
  args: {
    mono: true,
  },
};

export const InParagraph: Story = {
  render: () => (
    <p style={{ maxWidth: 480, lineHeight: 1.8 }}>
      Run <Code>npm install</Code> to install dependencies, or in mono contexts render it as{" "}
      <Code mono>npm install</Code> instead.
    </p>
  ),
};

export const Block: Story = {
  render: () => <Code.Block>{jsSample}</Code.Block>,
};

export const BlockMono: Story = {
  render: () => <Code.Block mono>{jsSample}</Code.Block>,
};

export const BlockHtml: Story = {
  render: () => <Code.Block>{htmlSample}</Code.Block>,
};
