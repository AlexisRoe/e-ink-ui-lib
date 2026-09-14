import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form } from "../form/form.component";
import { Signature } from "./signature.component";

const meta = {
  title: "Components/Forms/Signature",
  component: Signature,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    height: { control: "number" },
  },
} satisfies Meta<typeof Signature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Signature", placeholder: "Sign here" },
};

export const Required: Story = {
  args: { children: "Signature", required: true },
};

export const Disabled: Story = {
  args: { children: "Signature", disabled: true },
};

const SAMPLE_SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 128">
  <path d="M30,90 C50,40 70,40 85,70 C95,90 100,95 110,70 C120,45 125,40 135,60 C142,74 150,90 160,60 C168,36 175,50 185,80 C192,100 198,95 205,60" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M220,95 L250,35" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M230,55 C250,45 270,45 280,60 C288,72 275,85 260,80 C248,76 250,62 265,58 C280,54 300,60 310,80" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

/**
 * Passing `defaultValue` pre-renders a previously captured signature (SVG
 * markup, the same shape `onChange` produces) onto the pad — e.g. to show
 * what was signed earlier on a review screen. The user can still draw over
 * it or clear it.
 */
export const WithExistingSignature: Story = {
  args: { children: "Signature", defaultValue: SAMPLE_SIGNATURE_SVG },
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
