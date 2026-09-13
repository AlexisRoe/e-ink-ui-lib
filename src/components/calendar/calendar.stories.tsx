import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CalendarAppointment } from "../../utils/calendar.utils";
import { Calendar } from "./calendar.component";

const meta = {
  title: "Components/Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Black-and-white calendar with month, year, and single-day schedule views. " +
          "State (which view is active, which month is focused, which day is selected) " +
          "is managed internally via React context — `Calendar` is a self-contained, " +
          "controlled-by-nothing component; you only ever pass it `appointments` and an " +
          "optional `today`.\n\n" +
          "Opens on the current month with today highlighted. Click a day to see its " +
          "schedule (rendered with the standalone `Schedule` component, sized " +
          "identically). Click the month/year header label to zoom out to the year " +
          "view; click a month there to zoom back in.\n\n" +
          "Appointments use the same `CalendarAppointment` shape documented on the " +
          "`Schedule` component:\n\n" +
          "```ts\n" +
          "interface CalendarAppointment {\n" +
          "  id: string;\n" +
          '  date: string;        // "YYYY-MM-DD"\n' +
          '  time: string;        // 24h "HH:mm"\n' +
          "  title: string;\n" +
          "  description?: string;\n" +
          "}\n" +
          "```\n\n" +
          "Days (month view) and months (year view) that have appointments show a " +
          "filled count pill.",
      },
    },
  },
  argTypes: {
    appointments: {
      control: "object",
      description: "Appointments to plot as indicators and list in the day view.",
    },
    today: { control: "date", description: 'Date treated as "today". Defaults to `new Date()`.' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date(2026, 8, 13);

const appointments: CalendarAppointment[] = [
  { id: "standup", date: "2026-09-13", time: "09:00", title: "Daily stand-up" },
  {
    id: "review",
    date: "2026-09-13",
    time: "11:30",
    title: "Design review",
    description: "Room 2B, bring the wireframes",
  },
  { id: "lunch", date: "2026-09-13", time: "12:30", title: "Lunch with Sam" },
  { id: "planning", date: "2026-09-17", time: "10:00", title: "Sprint planning" },
  { id: "retro", date: "2026-09-25", time: "15:00", title: "Retrospective" },
  { id: "kickoff", date: "2026-10-05", time: "09:00", title: "Q4 kickoff" },
  { id: "offsite", date: "2026-11-12", time: "09:00", title: "Team offsite" },
];

export const Default: Story = {
  args: { today, appointments },
  render: (args) => (
    <div style={{ width: 480, height: 480 }}>
      <Calendar {...args} />
    </div>
  ),
};

export const NoAppointments: Story = {
  args: { today },
  render: (args) => (
    <div style={{ width: 480, height: 480 }}>
      <Calendar {...args} />
    </div>
  ),
};

/** Shrinks below the content's natural size to demonstrate the `min-width`/`min-height` floor. */
export const MinimumSize: Story = {
  args: { today, appointments },
  render: (args) => (
    <div style={{ width: 200, height: 200 }}>
      <Calendar {...args} />
    </div>
  ),
};

/** Grows past the content's natural size to demonstrate the calendar adapting to the available space. */
export const FillsAvailableSpace: Story = {
  args: { today, appointments },
  render: (args) => (
    <div style={{ width: "90vw", height: "80vh" }}>
      <Calendar {...args} />
    </div>
  ),
};
