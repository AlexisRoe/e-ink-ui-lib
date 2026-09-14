import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../components/card/card.component";
import { Description } from "../components/description/description.component";
import { Flex } from "../components/flex/flex.component";
import { Icon } from "../components/icons/icon";
import { Pill } from "../components/pill/pill.component";
import { Signature } from "../components/signature/signature.component";
import { Space } from "../components/space/space.component";
import { Stepper } from "../components/stepper/stepper.component";
import { Text } from "../components/text/text.component";
import { Timeline } from "../components/timeline/timeline.component";
import { Title } from "../components/title/title.component";

const ExampleWidth = 800;

/**
 * Example composition: a parcel tracking window combining a `Stepper` for
 * the high-level shipment stage and a `Timeline` for the detailed event
 * log, both inside a `Card`. Also shows dedicated single-step screens for
 * confirmation of sending, fulfillment, and the delivery handover
 * signature.
 */
const meta = {
  title: "Applications/Parcel Tracking",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Card style={{ width: ExampleWidth }}>
      <Card.Header>
        <Card.Title>Parcel #DHL0034043471</Card.Title>
        <Card.Subtitle>Estimated delivery: today, by 18:00</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        <Stepper currentIndex={2}>
          <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
          <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
          <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
          <Stepper.Item title="Delivered">Against signature</Stepper.Item>
        </Stepper>
        <Space size="64" />
        <Timeline>
          <Timeline.Item time="28 Aug, 09:12" title="Order placed" state="done">
            Confirmed and sent to fulfillment
          </Timeline.Item>
          <Timeline.Item time="28 Aug, 15:40" title="Packed" state="done">
            Fulfillment center, Leipzig
          </Timeline.Item>
          <Timeline.Item time="29 Aug, 06:05" title="Departed facility" state="done">
            DHL sort center, Leipzig
          </Timeline.Item>
          <Timeline.Item time="Today, 07:20" title="Out for delivery" state="pending">
            Local depot, on vehicle
          </Timeline.Item>
          <Timeline.Item time="Expected at 18:00" title="Delivered" state="todo">
            Signature required
          </Timeline.Item>
        </Timeline>
      </Card.Content>
    </Card>
  ),
};

export const Step1Confirmation: Story = {
  name: "Step 1 · Confirmation of sending",
  args: { children: null },
  render: () => (
    <Card style={{ width: ExampleWidth }}>
      <Card.Header>
        <Card.Title>Order confirmed</Card.Title>
        <Card.Subtitle>Parcel #DHL0034043471</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        <Stepper currentIndex={0}>
          <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
          <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
          <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
          <Stepper.Item title="Delivered">Against signature</Stepper.Item>
        </Stepper>
        <Space size="48" />
        <Flex column align="center" gap="md">
          <Icon name="circle-check" size={64} aria-hidden="true" />
          <Title size="2">Thanks for your order!</Title>
          <Text>A confirmation email is on its way to you.</Text>
          <Space size="8" />
          <Description.Group orientation="horizontal">
            <Description label="Items" value="2" />
            <Description label="Ordered" value="28 Aug, 09:12" />
            <Description label="Total" value="€54.80" />
          </Description.Group>
          <Pill icon="mail">Confirmation sent</Pill>
        </Flex>
      </Card.Content>
    </Card>
  ),
};

export const Step2Fulfillment: Story = {
  name: "Step 2 · Fulfillment",
  args: { children: null },
  render: () => (
    <Card style={{ width: ExampleWidth }}>
      <Card.Header>
        <Card.Title>Preparing your parcel</Card.Title>
        <Card.Subtitle>Parcel #DHL0034043471</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        <Stepper currentIndex={1}>
          <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
          <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
          <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
          <Stepper.Item title="Delivered">Against signature</Stepper.Item>
        </Stepper>
        <Space size="48" />
        <Flex column align="center" gap="md">
          <Icon name="folder" size={64} aria-hidden="true" />
          <Title size="2">Your order is being packed</Title>
          <Text>Fulfillment center, Leipzig</Text>
          <Space size="8" />
          <Timeline>
            <Timeline.Item time="09:12" title="Items picked" state="done">
              2 items retrieved from warehouse
            </Timeline.Item>
            <Timeline.Item time="14:05" title="Packed" state="pending">
              Boxed and labeled
            </Timeline.Item>
            <Timeline.Item time="Expected 16:00" title="Handed to carrier" state="todo">
              DHL pickup
            </Timeline.Item>
          </Timeline>
        </Flex>
      </Card.Content>
    </Card>
  ),
};

export const Step4Signature: Story = {
  name: "Step 4 · Signature (handover)",
  args: { children: null },
  render: () => (
    <Card style={{ width: ExampleWidth }}>
      <Card.Header>
        <Card.Title>Confirm delivery</Card.Title>
        <Card.Subtitle>Parcel #DHL0034043471</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        <Stepper currentIndex={3}>
          <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
          <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
          <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
          <Stepper.Item title="Delivered">Against signature</Stepper.Item>
        </Stepper>
        <Space size="48" />
        <Flex column align="center" gap="md">
          <Icon name="edit" size={48} aria-hidden="true" />
          <Title size="2">Sign to confirm handover</Title>
          <Text>Please sign below to confirm you received this parcel.</Text>
          <Signature placeholder="Sign here" required>
            Recipient signature
          </Signature>
        </Flex>
      </Card.Content>
    </Card>
  ),
};
