import type { Meta, StoryObj } from "@storybook/react-vite";
// biome-ignore lint/suspicious/noShadowRestrictedNames: `Number` is the intended public component name.
import { Number } from "./number.component";

const meta = {
  title: "Numbers/Number",
  component: Number,
  tags: ["autodocs"],
  args: {
    value: 1234567.891,
  },
  argTypes: {
    value: {
      control: "number",
      description: "The numeric value to display.",
    },
    prefix: {
      control: "text",
      description: "Text rendered before the value, e.g. a currency symbol.",
    },
    suffix: {
      control: "text",
      description: "Text rendered after the value, e.g. a unit.",
    },
    roundDecimal: {
      control: "number",
      description: "Number of decimal places to round to. Defaults to false (no rounding).",
    },
    groupingBy: {
      control: "select",
      options: ["none", "thousands", "lakh", "wan"],
      description: "Digit grouping strategy for the integer part. Defaults to none.",
    },
    separatorStyle: {
      control: "radio",
      options: ["us", "eu"],
      description: "Thousands/decimal separator characters to use. Defaults to us.",
    },
  },
} satisfies Meta<typeof Number>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPrefixAndSuffix: Story = {
  args: {
    prefix: "€",
    roundDecimal: 2,
    groupingBy: "thousands",
  },
};

export const Thousands: Story = {
  args: {
    roundDecimal: 2,
    groupingBy: "thousands",
  },
};

export const Lakh: Story = {
  args: {
    roundDecimal: 2,
    groupingBy: "lakh",
  },
};

export const Wan: Story = {
  args: {
    roundDecimal: 2,
    groupingBy: "wan",
  },
};

export const EuropeanSeparators: Story = {
  args: {
    roundDecimal: 2,
    groupingBy: "thousands",
    separatorStyle: "eu",
  },
};
