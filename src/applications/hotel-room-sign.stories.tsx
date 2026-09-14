import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "../components/container/container.component";
import { Flex } from "../components/flex/flex.component";
import { List } from "../components/list/list.component";
import { Timeline } from "../components/timeline/timeline.component";
import { Title } from "../components/title/title.component";

/**
 * Example composition: a hotel conference room sign showing a full-day
 * meeting agenda via `Timeline`, plus a `List` of amenities, under a
 * `Title` header.
 */
const meta = {
  title: "Applications/Hotel Room Sign",
  component: Container,
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Container withBorder style={{ width: 400, padding: "1rem" }}>
      <Flex column gap="md">
        <Title size={2}>Grand Ballroom</Title>
        <Timeline>
          <Timeline.Item time="08:00" title="Registration & breakfast" state="done">
            Foyer
          </Timeline.Item>
          <Timeline.Item time="09:00" title="Keynote: State of the Industry" state="done">
            Main stage
          </Timeline.Item>
          <Timeline.Item time="11:00" title="Panel discussion" state="pending">
            Sustainability track
          </Timeline.Item>
          <Timeline.Item time="13:00" title="Lunch" state="todo">
            Terrace
          </Timeline.Item>
          <Timeline.Item time="15:00" title="Workshops" state="todo">
            Breakout rooms A–D
          </Timeline.Item>
          <Timeline.Item time="18:00" title="Closing reception" state="todo">
            Main stage
          </Timeline.Item>
        </Timeline>
        <List as="detailed">
          <List.Item title="Wi-Fi" description="Network: GrandHotel-Guest" />
          <List.Item title="Catering" description="Contact front desk for dietary requests" />
          <List.Item title="Capacity" description="Up to 220 guests, theatre style" />
        </List>
      </Flex>
    </Container>
  ),
};
