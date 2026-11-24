import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.component";
import { useNotifications } from "../notification/notification.provider";
import { EinkProvider } from "./provider.component";

const meta = {
  title: "Components/Utility/EinkProvider",
  component: EinkProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof EinkProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function NotifyButton() {
  const { notify } = useNotifications();
  return <Button onClick={() => notify("Saved", "Everything is wired up.")}>Notify</Button>;
}

export const Default: Story = {
  args: { children: null },
  render: (args) => (
    <EinkProvider {...args}>
      <NotifyButton />
    </EinkProvider>
  ),
};
