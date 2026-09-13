import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.component";
import { NotificationProvider, useNotifications } from "./notification.provider";

const meta = {
  title: "Components/Layout/Notification",
  component: NotificationProvider,
  tags: ["autodocs"],
  argTypes: {
    duration: { control: "number" },
  },
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { notify } = useNotifications();
  return (
    <>
      <Button onClick={() => notify("Saved", "Your changes have been saved.")}>Info</Button>{" "}
      <Button onClick={() => notify("Check your input", "Some fields look unusual.", "warning")}>
        Warning
      </Button>{" "}
      <Button onClick={() => notify("Something went wrong", "Please try again.", "error")}>
        Error
      </Button>
    </>
  );
}

export const Default: Story = {
  args: { duration: 4000, children: null },
  render: (args) => (
    <NotificationProvider duration={args.duration}>
      <Demo />
    </NotificationProvider>
  ),
};

export const Stacked: Story = {
  args: { duration: 4000, children: null },
  render: (args) => {
    function StackedDemo() {
      const { notify } = useNotifications();
      return (
        <Button
          onClick={() => {
            notify("First notification", "Fired first.");
            notify("Check your input", "Fired shortly after.", "warning");
            notify("Something went wrong", "Resets the shared timer.", "error");
          }}
        >
          Fire three notifications
        </Button>
      );
    }
    return (
      <NotificationProvider duration={args.duration}>
        <StackedDemo />
      </NotificationProvider>
    );
  },
};
