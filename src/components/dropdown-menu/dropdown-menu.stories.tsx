import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Text } from "../text/text.component";
import { DropdownMenu } from "./dropdown-menu.component";

const meta = {
  title: "Components/Actions/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function WithSelectedId(props: React.ComponentProps<typeof DropdownMenu>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div>
      <DropdownMenu {...props} onSelect={setSelectedId} />
      <Text style={{ marginTop: 12 }}>
        onSelect returned: <strong>{selectedId ?? "(nothing selected yet)"}</strong>
      </Text>
    </div>
  );
}

/**
 * Drag the bottom-right corner to resize the surrounding box directly in
 * Storybook's canvas — useful for checking that a submenu flips from right
 * to left once it would overflow the available width.
 */
function ResizableStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        border: "1px dashed var(--eink-color-grey-70)",
        padding: 16,
        width: 360,
        minWidth: 160,
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    label: "Actions",
    children: (
      <DropdownMenu.Group label="Document">
        <DropdownMenu.Item id="edit" icon="edit" keys="⌘E">
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item id="duplicate" icon="copy" keys="⌘D">
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Item id="share" icon="share">
          Share
        </DropdownMenu.Item>
        <DropdownMenu.Item id="delete" icon="trash" disabled mono>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    ),
  },
  render: (args) => <WithSelectedId {...args} />,
};

export const MultipleGroups: Story = {
  args: {
    label: "Actions",
    children: (
      <>
        <DropdownMenu.Group label="Document">
          <DropdownMenu.Item id="edit" icon="edit" keys="⌘E">
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item id="duplicate" icon="copy" keys="⌘D">
            Duplicate
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group label="Danger zone">
          <DropdownMenu.Item id="archive" icon="folder">
            Archive
          </DropdownMenu.Item>
          <DropdownMenu.Item id="delete" icon="trash">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </>
    ),
  },
  render: (args) => <WithSelectedId {...args} />,
};

/**
 * Resizable: drag the bottom-right corner of the dashed box to shrink it and
 * watch the "Share" submenu auto-flip from opening on the right to opening
 * on the left once it would overflow.
 */
export const WithSubmenu: Story = {
  args: {
    label: "File",
    children: (
      <>
        <DropdownMenu.Item id="new" icon="file" keys="⌘N">
          New
        </DropdownMenu.Item>
        <DropdownMenu.Item id="share" icon="share">
          Share
          <DropdownMenu.Item id="share-link" icon="external-link">
            Copy link
          </DropdownMenu.Item>
          <DropdownMenu.Item id="share-email" icon="mail">
            Email
          </DropdownMenu.Item>
        </DropdownMenu.Item>
      </>
    ),
  },
  render: (args) => (
    <ResizableStage>
      <WithSelectedId {...args} />
    </ResizableStage>
  ),
};

export const DisabledItems: Story = {
  args: {
    label: "Actions",
    children: (
      <>
        <DropdownMenu.Item id="edit" icon="edit">
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item id="archive" icon="folder" disabled>
          Archive (unavailable)
        </DropdownMenu.Item>
        <DropdownMenu.Item id="delete" icon="trash" disabled mono>
          Delete (mono disabled)
        </DropdownMenu.Item>
      </>
    ),
  },
  render: (args) => <WithSelectedId {...args} />,
};

/** Forces the submenu open on the left instead of the default auto-flip-on-overflow behavior. */
export const SubmenuForcedLeft: Story = {
  args: {
    label: "File",
    children: (
      <DropdownMenu.Item id="share" icon="share" side="left">
        Share
        <DropdownMenu.Item id="share-link">Copy link</DropdownMenu.Item>
        <DropdownMenu.Item id="share-email">Email</DropdownMenu.Item>
      </DropdownMenu.Item>
    ),
  },
  render: (args) => <WithSelectedId {...args} />,
};

export const DisabledTrigger: Story = {
  args: {
    label: "Actions",
    disabled: true,
    children: <DropdownMenu.Item id="edit">Edit</DropdownMenu.Item>,
  },
  render: (args) => <WithSelectedId {...args} />,
};
