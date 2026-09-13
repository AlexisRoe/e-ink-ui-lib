import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button/button.component";
import { Modal } from "./modal.component";
import { ModalProvider } from "./modal.provider";

const meta = {
  title: "Components/Layout/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "xl"] },
    overlay: { control: "select", options: ["white", "black", "transparent", "semi-transparent"] },
  },
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo(args: Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        title="Delete item"
        size="md"
        overlay="semi-transparent"
        {...args}
        open={open}
        onClosed={() => setOpen(false)}
        onAccept={() => setOpen(false)}
      >
        <Modal.Close />
        <p>This action can't be undone.</p>
        <Modal.CloseButton>Cancel</Modal.CloseButton>
        <Modal.ActionButton>Delete</Modal.ActionButton>
      </Modal>
    </>
  );
}

export const Default: Story = {
  args: { open: false, title: "Delete item" },
  render: (args) => <ModalDemo {...args} />,
};

export const WithoutCloseIcon: Story = {
  args: { open: false, title: "Delete item" },
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Modal title="Delete item" open={open} onClosed={() => setOpen(false)}>
            <p>This action can't be undone.</p>
            <Modal.CloseButton>Cancel</Modal.CloseButton>
            <Modal.ActionButton>Delete</Modal.ActionButton>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const Sizes: Story = {
  args: { open: false, title: "Delete item" },
  render: () => {
    function Demo() {
      const [openSize, setOpenSize] = useState<"sm" | "md" | "xl" | null>(null);
      return (
        <>
          <Button onClick={() => setOpenSize("sm")}>Open small</Button>{" "}
          <Button onClick={() => setOpenSize("md")}>Open medium</Button>{" "}
          <Button onClick={() => setOpenSize("xl")}>Open extra large</Button>
          <Modal
            title="Delete item"
            size={openSize ?? "md"}
            open={openSize !== null}
            onClosed={() => setOpenSize(null)}
          >
            <Modal.Close />
            <p>This action can't be undone.</p>
            <Modal.CloseButton>Cancel</Modal.CloseButton>
            <Modal.ActionButton>Delete</Modal.ActionButton>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const OverlayVariants: Story = {
  args: { open: false, title: "Delete item" },
  render: () => {
    function Demo() {
      const [overlay, setOverlay] = useState<
        "white" | "black" | "transparent" | "semi-transparent" | null
      >(null);
      return (
        <>
          <Button onClick={() => setOverlay("white")}>White overlay</Button>{" "}
          <Button onClick={() => setOverlay("black")}>Black overlay</Button>{" "}
          <Button onClick={() => setOverlay("transparent")}>Transparent overlay</Button>{" "}
          <Button onClick={() => setOverlay("semi-transparent")}>Semi-transparent overlay</Button>
          <Modal
            title="Delete item"
            overlay={overlay ?? "semi-transparent"}
            open={overlay !== null}
            onClosed={() => setOverlay(null)}
          >
            <Modal.Close />
            <p>This action can't be undone.</p>
            <Modal.CloseButton>Cancel</Modal.CloseButton>
            <Modal.ActionButton>Delete</Modal.ActionButton>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const MultipleModals: Story = {
  args: { open: false, title: "Delete item" },
  render: () => {
    function Demo() {
      const [firstOpen, setFirstOpen] = useState(false);
      const [secondOpen, setSecondOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setFirstOpen(true)}>Open first modal</Button>
          <Modal title="First modal" open={firstOpen} onClosed={() => setFirstOpen(false)}>
            <Modal.Close />
            <Button onClick={() => setSecondOpen(true)}>Open second modal</Button>
            <Modal.CloseButton>Close</Modal.CloseButton>
          </Modal>
          <Modal title="Second modal" open={secondOpen} onClosed={() => setSecondOpen(false)}>
            <Modal.Close />
            <p>Stacked on top of the first modal.</p>
            <Modal.CloseButton>Close</Modal.CloseButton>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};
