import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CalendarAppointment } from "../../utils/calendar.utils";
import { Schedule } from "./schedule.component";

const meta = {
  title: "Components/Data Display/Schedule",
  component: Schedule,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Standalone list of a single day's appointments, sorted by time. " +
          "Each appointment is a `CalendarAppointment`:\n\n" +
          "```ts\n" +
          "interface CalendarAppointment {\n" +
          "  id: string;          // stable unique id, used as the React key\n" +
          '  date: string;        // "YYYY-MM-DD"\n' +
          '  time: string;        // 24h "HH:mm"\n' +
          "  title: string;\n" +
          "  description?: string;\n" +
          "}\n" +
          "```\n\n" +
          "`Schedule` filters `appointments` down to the given `date` itself, so the " +
          "full appointment list for a calendar can be passed straight through without " +
          "pre-filtering. It's used standalone here, and also embedded as the day view " +
          "of `Calendar` — sized identically in both places.",
      },
    },
  },
  argTypes: {
    date: { control: "date", description: "Day to show. Only year/month/day are used." },
    appointments: { control: "object", description: "Full appointment list; filtered to `date`." },
    title: { control: "text", description: "Heading override. Defaults to the formatted `date`." },
    emptyLabel: {
      control: "text",
      description: "Shown instead of the list when there are no appointments.",
    },
    onBack: { description: "When provided, renders a back button that calls this on click." },
  },
} satisfies Meta<typeof Schedule>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAppointments: CalendarAppointment[] = [
  { id: "standup", date: "2026-09-14", time: "09:00", title: "Daily stand-up" },
  {
    id: "review",
    date: "2026-09-14",
    time: "11:30",
    title: "Design review",
    description: "Room 2B, bring the wireframes",
  },
  { id: "lunch", date: "2026-09-14", time: "12:30", title: "Lunch with Sam" },
  {
    id: "dentist",
    date: "2026-09-14",
    time: "17:00",
    title: "Dentist appointment",
    description: "Downtown clinic",
  },
];

export const Default: Story = {
  args: {
    date: new Date(2026, 8, 14),
    appointments: sampleAppointments,
  },
};

export const Empty: Story = {
  args: {
    date: new Date(2026, 8, 20),
    appointments: sampleAppointments,
  },
};

export const WithBackButton: Story = {
  args: {
    date: new Date(2026, 8, 14),
    appointments: sampleAppointments,
    onBack: () => alert("Back"),
  },
};
