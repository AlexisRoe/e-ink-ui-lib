import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form } from "../form/form.component";
import { Signature } from "./signature.component";

const meta = {
  title: "Components/Forms/Signature",
  component: Signature,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    height: { control: "number" },
  },
} satisfies Meta<typeof Signature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Signature" },
};

export const Required: Story = {
  args: { children: "Signature", required: true },
};

export const Disabled: Story = {
  args: { children: "Signature", disabled: true },
};

/**
 * `onChange` receives standalone SVG markup after every stroke, or `null`
 * once cleared — the consumer decides how (and whether) to persist it.
 */
export const WithOnChange: Story = {
  args: { children: "Signature" },
  render: (args) => {
    function Example() {
      const [svg, setSvg] = useState<string | null>(null);
      return (
        <div>
          <Signature {...args} onChange={setSvg} />
          <p style={{ marginTop: 16, fontSize: 12 }}>
            {svg ? "Signature captured (SVG stored by the consumer)." : "Not signed yet."}
          </p>
        </div>
      );
    }
    return <Example />;
  },
};

export const InAForm: Story = {
  args: { children: "" },
  render: () => (
    <Form initialValues={{ signature: undefined }} onSubmit={() => {}}>
      <Signature name="signature" required>
        Signature
      </Signature>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
