import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "../flex/flex.component";
import { Form } from "../form/form.component";
import { FileUpload } from "./file-upload.component";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function simulateUpload(file: File) {
  await delay(1500);
  if (file.size === 0) {
    throw new Error("File is empty");
  }
}

const meta = {
  title: "Components/Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    accept: { control: "object" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onUpload: simulateUpload,
    children: "Attachment",
  },
};

export const RestrictedFileTypes: Story = {
  args: {
    onUpload: simulateUpload,
    accept: [".pdf", "image/*"],
    children: "Photo or PDF",
  },
};

export const Disabled: Story = {
  args: {
    onUpload: simulateUpload,
    disabled: true,
    children: "Attachment",
  },
};

export const InAForm: Story = {
  args: {
    onUpload: simulateUpload,
    children: "Attachment",
  },
  render: () => (
    <Form initialValues={{ attachment: "" }} onSubmit={() => {}}>
      <Flex column gap="md">
        <FileUpload name="attachment" onUpload={simulateUpload}>
          Attachment
        </FileUpload>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Flex>
    </Form>
  ),
};
