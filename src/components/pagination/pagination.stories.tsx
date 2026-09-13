import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./pagination.component";

const meta = {
  title: "Components/Layout/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    pageCount: { control: "number" },
    page: { control: "number" },
    siblingCount: { control: "number" },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePagination(props: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(props.page);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

export const Default: Story = {
  args: {
    pageCount: 5,
    page: 1,
  },
  render: (args) => <InteractivePagination {...args} />,
};

/** Table/datasheet-sized book with many pages: first, last, current, and
 * its neighbors stay visible while the rest collapses into a filler. */
export const ManyPages: Story = {
  args: {
    pageCount: 240,
    page: 32,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const NearTheStart: Story = {
  args: {
    pageCount: 100,
    page: 2,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const NearTheEnd: Story = {
  args: {
    pageCount: 100,
    page: 99,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const WideSiblingCount: Story = {
  args: {
    pageCount: 100,
    page: 50,
    siblingCount: 3,
  },
  render: (args) => <InteractivePagination {...args} />,
};
