import type { Meta, StoryObj } from "@storybook/react-vite";
import office from "../../assets/example-images/office.jpeg";
import { Image } from "./image.component";

const meta = {
  title: "Components/Data Display/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text" },
    width: { control: "number" },
    height: { control: "number" },
    aspectRatio: { control: "number" },
    fit: {
      control: "select",
      options: ["cover", "contain", "fill", "none", "scale-down"],
    },
    withBorder: { control: "boolean" },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: office,
    width: 320,
    height: 200,
    label: "Office",
  },
};

export const Contain: Story = {
  args: {
    src: office,
    width: 320,
    height: 200,
    fit: "contain",
    label: "Office",
  },
};

export const NoBorder: Story = {
  args: {
    src: office,
    width: 320,
    height: 200,
    withBorder: false,
    label: "Office",
  },
};

export const Placeholder: Story = {
  args: {
    src: "",
    width: 320,
    height: 200,
    label: "Office",
  },
};
