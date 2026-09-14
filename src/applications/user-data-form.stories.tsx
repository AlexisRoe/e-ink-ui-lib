import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "../components/checkbox/checkbox.component";
import { Container } from "../components/container/container.component";
import { DateInput } from "../components/date-input/date-input.component";
import { Flex } from "../components/flex/flex.component";
import { Form } from "../components/form/form.component";
import { Input } from "../components/input/input.component";
import { RadioInput } from "../components/radio-input/radio-input.component";
import { Select } from "../components/select/select.component";
import { Space } from "../components/space/space.component";
import { Text } from "../components/text/text.component";
import { TextArea } from "../components/text-area/text-area.component";
import { Title } from "../components/title/title.component";
import { isEmail, isRequired } from "../utils/validate.utils";

interface UserDataValues {
  [key: string]: unknown;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  gender: string;
  country: string;
  bio: string;
  newsletter: boolean;
}

/**
 * Example composition: a user data entry form combining `Form` (for shared
 * field state, validation and dirty tracking) with `Input`, `DateInput`,
 * `RadioInput.Group`, `Select`, `TextArea` and `Checkbox` fields, wrapped in
 * a `Container`.
 */
const meta = {
  title: "Applications/User Data Form",
  component: Form,
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

function UserDataFormDemo() {
  const [saved, setSaved] = useState<UserDataValues | null>(null);

  return (
    <Container withBorder style={{ width: 800, padding: "1rem" }}>
      <Title size={3}>Your details</Title>
      <Space size="16" />
      <Form<UserDataValues>
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          birthday: "",
          gender: "f",
          country: "",
          bio: "",
          newsletter: false,
        }}
        onSubmit={(values) => setSaved(values)}
        onReset={() => setSaved(null)}
      >
        <Flex column gap="md">
          <Flex gap="md">
            <Input name="firstName" validate={isRequired} required>
              First name
            </Input>
            <Input name="lastName" validate={isRequired} required>
              Last name
            </Input>
          </Flex>
          <Input name="email" type="email" validate={isEmail} required>
            Email
          </Input>
          <DateInput name="birthday">Birthday</DateInput>
          <Space />
          <RadioInput.Group name="gender" label="Gender" orientation="horizontal">
            <RadioInput value="f">Female</RadioInput>
            <RadioInput value="m">Male</RadioInput>
            <RadioInput value="o">Other</RadioInput>
          </RadioInput.Group>
          <Space />
          <Select name="country" label="Country" placeholder="Select…">
            <Select.Option value="de">Germany</Select.Option>
            <Select.Option value="at">Austria</Select.Option>
            <Select.Option value="ch">Switzerland</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
          <TextArea name="bio" minHeight="4rem">
            Bio
          </TextArea>
          <Checkbox name="newsletter">Subscribe to the newsletter</Checkbox>
          <Space />
          <Flex gap="sm">
            <Form.SubmitButton>Save</Form.SubmitButton>
            <Form.ResetButton>Reset</Form.ResetButton>
          </Flex>
        </Flex>
      </Form>
      {saved ? (
        <>
          <Space size="16" />
          <Text>
            Saved: {saved.firstName} {saved.lastName} · {saved.email}
          </Text>
        </>
      ) : null}
    </Container>
  );
}

export const Default: Story = {
  args: { initialValues: {}, children: null },
  render: () => <UserDataFormDemo />,
};
