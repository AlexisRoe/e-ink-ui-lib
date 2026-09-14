import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "../components/container/container.component";
import { Flex } from "../components/flex/flex.component";
import { LastUpdated } from "../components/last-updated/last-updated.component";
import { Pill } from "../components/pill/pill.component";
import { Schedule } from "../components/schedule/schedule.component";
import { Title } from "../components/title/title.component";
import type { CalendarAppointment } from "../utils/calendar.utils";

/**
 * Example composition: a meeting room door sign combining `Title` for the
 * room name, `Pill` for the current occupancy state, `Schedule` for the
 * day's bookings, and `LastUpdated` to show sync freshness.
 */
const meta = {
  title: "Applications/Meeting Room Sign",
  component: Container,
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const appointments: CalendarAppointment[] = [
  { id: "standup", date: "2026-09-14", time: "09:00", title: "Daily stand-up" },
  {
    id: "review",
    date: "2026-09-14",
    time: "11:30",
    title: "Design review",
    description: "Product team",
  },
  {
    id: "interview",
    date: "2026-09-14",
    time: "14:00",
    title: "Candidate interview",
    description: "Panel: Jane, Sam",
  },
];

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Container withBorder style={{ width: 360, padding: "1rem" }}>
      <Flex column gap="md">
        <Flex justify="space-between" align="start">
          <Title size={2}>Room 2B</Title>
          <Pill.Filled size="xl" icon="circle-off">
            Occupied
          </Pill.Filled>
        </Flex>
        <Schedule date={new Date(2026, 8, 14)} appointments={appointments} title="Today" />
        <LastUpdated date={new Date(Date.now() - 20_000)}>Sync status</LastUpdated>
      </Flex>
    </Container>
  ),
};
