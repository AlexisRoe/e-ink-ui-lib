import type { Meta, StoryObj } from "@storybook/react-vite";
import { Barcode } from "./barcode.component";

const meta = {
  title: "Components/Data Display/Barcode",
  component: Barcode,
  tags: ["autodocs"],
  args: {
    value: "4006381333931",
    format: "ean13",
    width: 240,
  },
  argTypes: {
    format: {
      control: "select",
      options: [
        "code128",
        "code39",
        "ean13",
        "ean8",
        "upc",
        "itf14",
        "msi",
        "pharmacode",
        "codabar",
      ],
    },
    width: { control: "number" },
    withValue: { control: "boolean" },
  },
} satisfies Meta<typeof Barcode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ean13: Story = {};

export const Code128: Story = {
  args: {
    value: "SKU-A19042-XL",
    format: "code128",
  },
};

export const Code39: Story = {
  args: {
    value: "CODE-39",
    format: "code39",
  },
};

export const Itf14: Story = {
  args: {
    value: "00012345678905",
    format: "itf14",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Cereal, 500g",
  },
};

export const WithoutEncodedValueText: Story = {
  args: {
    withValue: false,
    label: "Cereal, 500g",
  },
};
