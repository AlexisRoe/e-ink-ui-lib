import type { Meta, StoryObj } from "@storybook/react-vite";
import { Quote } from "./quote.component";

const meta = {
  title: "Components/Typography/Quote",
  component: Quote,
  tags: ["autodocs"],
  args: {
    children: "Life is like an npm install — you never know what you are going to get.",
    cite: "Forrest Gump",
  },
  argTypes: {
    cite: {
      control: "text",
      description: "Optional source of the quote, rendered as a citation below the text.",
    },
    mono: {
      control: "boolean",
      description: "When true, renders in plain black and white.",
    },
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCite: Story = {
  args: {
    cite: undefined,
  },
};

export const Mono: Story = {
  args: {
    mono: true,
  },
};
