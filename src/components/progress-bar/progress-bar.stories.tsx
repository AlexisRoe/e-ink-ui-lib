import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./progress-bar.component";

const meta = {
  title: "Components/Data Display/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    label: { control: "text" },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 42,
    label: "Upload",
  },
};

export const Naked: Story = {
  args: { value: 42 },
  render: () => <ProgressBar.Naked value={42} />,
};

export const Diagonal: Story = {
  args: { value: 42, label: "Upload" },
  render: () => <ProgressBar.Diagonal value={42} label="Upload" />,
};

export const Stepper: Story = {
  args: { value: 42, label: "Upload" },
  render: () => <ProgressBar.Stepper steps={5} currentStep={1} label="Upload" />,
};

export const StepperComplete: Story = {
  args: { value: 100, label: "Upload" },
  render: () => <ProgressBar.Stepper steps={7} currentStep={7} label="Upload" />,
};
