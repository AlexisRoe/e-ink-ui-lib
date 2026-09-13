import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert.component";

const meta = {
  title: "Components/Data Display/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Required. Title of the alert." },
    description: {
      control: "text",
      description: "Optional supporting text shown below the title.",
    },
    variant: {
      control: "select",
      options: ["info", "warning", "error"],
      description: "Left-hand bar variant. Defaults to `info`.",
    },
    icon: {
      control: "select",
      options: [undefined, "info-circle", "alert-triangle", "alert-circle"],
      description: "Optional icon rendered to the left of the title.",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "New update available",
    description: "Restart the app to install the latest version.",
  },
};

export const InfoWithIcon: Story = {
  name: "Info with icon",
  args: {
    variant: "info",
    icon: "info-circle",
    title: "New update available",
    description: "Restart the app to install the latest version.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Low battery",
    description: "Connect a charger soon to avoid losing your progress.",
  },
};

export const WarningWithIcon: Story = {
  name: "Warning with icon",
  args: {
    variant: "warning",
    icon: "alert-triangle",
    title: "Low battery",
    description: "Connect a charger soon to avoid losing your progress.",
  },
};

export const ErrorAlert: Story = {
  name: "Error",
  args: {
    variant: "error",
    title: "Sync failed",
    description: "Check your connection and try again.",
  },
};

export const ErrorWithIcon: Story = {
  name: "Error with icon",
  args: {
    variant: "error",
    icon: "alert-circle",
    title: "Sync failed",
    description: "Check your connection and try again.",
  },
};
