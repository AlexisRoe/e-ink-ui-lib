import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table.component";

const meta = {
  title: "Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Table.Head>
          <Table.HeaderCell>Name</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Anna König</Table.Cell>
          </Table.Row>
        </Table.Body>
      </>
    ),
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Table {...args} onSelectionChange={(indexes) => console.log("selected", indexes)}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
        <Table.HeaderCell>Team</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
          <Table.Cell>Docs</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
          <Table.Cell>Ops</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Clara Hahn</Table.Cell>
          <Table.Cell>Reviewer</Table.Cell>
          <Table.Cell>Docs</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>David Eich</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
          <Table.Cell>Eng</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithNonSelectableRow: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row selectable={false}>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithDisabledRow: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row disabled>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Suspended</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithDisabledRowMono: Story = {
  render: (args) => (
    <Table {...args} mono>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row disabled>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Suspended</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const Preselected: Story = {
  render: (args) => (
    <Table {...args} preselectedIndexes={[1]}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const StickyHeader: Story = {
  render: (args) => (
    <div style={{ height: 200, overflow: "auto" }}>
      <Table {...args} stickyHeader>
        <Table.Head>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {Array.from({ length: 20 }, (_, index) => `person-${index}`).map((id, index) => (
            <Table.Row key={id}>
              <Table.Cell>Person {index + 1}</Table.Cell>
              <Table.Cell>Editor</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body />
    </Table>
  ),
};

export const EmptyWithCustomLabel: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body emptyLabel="No members yet" />
    </Table>
  ),
};

export const TruncatedContent: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Table {...args}>
        <Table.Head>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Anna König</Table.Cell>
            <Table.Cell>
              A very long description that will not fit in the available column width
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};
