import type { Meta, StoryObj } from "@storybook/react-vite";
import { Price } from "./price.component";

const meta = {
  title: "Numbers/Price",
  component: Price,
  tags: ["autodocs"],
  args: {
    value: 3.99,
    currency: "€",
  },
  argTypes: {
    value: {
      control: "number",
      description: "The price to display, as a standard (American-formatted) JS number.",
    },
    currency: {
      control: "text",
      description: "Currency symbol or code rendered alongside the decimal part.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "xl"],
      description: "Size of the price. Defaults to md.",
    },
    groupingBy: {
      control: "select",
      options: ["none", "thousands", "lakh", "wan"],
      description: "Digit grouping strategy for the integer part. Defaults to thousands.",
    },
    separatorStyle: {
      control: "radio",
      options: ["us", "eu"],
      description: "Thousands/decimal separator characters to use. Defaults to us.",
    },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    separatorStyle: "eu",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    separatorStyle: "eu",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    separatorStyle: "eu",
  },
};

export const LargeAmountThousands: Story = {
  args: {
    value: 1234567.5,
    currency: "$",
    groupingBy: "thousands",
  },
};

export const LargeAmountLakh: Story = {
  args: {
    value: 1234567.5,
    currency: "₹",
    groupingBy: "lakh",
  },
};

export const LargeAmountWan: Story = {
  args: {
    value: 123456789,
    currency: "¥",
    groupingBy: "wan",
  },
};

export const Negative: Story = {
  args: {
    value: -3.99,
    separatorStyle: "eu",
  },
};
