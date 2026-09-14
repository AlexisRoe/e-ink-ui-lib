import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Label } from "../label/label.component";
import { Form } from "./form.component";
import { useFormField } from "./form.context";

function TextField({ name, label }: { name: string; label: string }) {
  const { value, error, setValue, setError } = useFormField(name);

  return (
    <Flex column gap="sm">
      <Label>{label}</Label>
      <input
        aria-label={label}
        value={(value as string) ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          setError(next.trim() ? undefined : `${label} is required`);
        }}
      />
      {error ? <span>{error}</span> : null}
    </Flex>
  );
}

const meta = {
  title: "Components/Forms/Form",
  component: Form,
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValues: {},
    children: null,
  },
  render: () => {
    const [saved, setSaved] = useState<string | null>(null);

    return (
      <Flex column gap="md">
        <Form
          initialValues={{ name: "", email: "" }}
          onSubmit={(values) => setSaved(JSON.stringify(values))}
          onReset={() => setSaved(null)}
        >
          <TextField name="name" label="Name" />
          <TextField name="email" label="Email" />
          <Flex gap="sm">
            <Form.SubmitButton>Save</Form.SubmitButton>
            <Form.ResetButton>Reset</Form.ResetButton>
          </Flex>
        </Form>
        {saved ? <span>Saved: {saved}</span> : null}
      </Flex>
    );
  },
};
