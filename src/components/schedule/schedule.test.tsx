import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CalendarAppointment } from "../../utils/calendar.utils";
import { Schedule } from "./schedule.component";

const appointments: CalendarAppointment[] = [
  { id: "late", date: "2026-09-14", time: "14:00", title: "Design review", description: "Room 2B" },
  { id: "early", date: "2026-09-14", time: "09:00", title: "Stand-up" },
  { id: "other-day", date: "2026-09-15", time: "10:00", title: "Not shown" },
];

describe("Schedule", () => {
  it("renders only appointments for the given date, sorted by time", () => {
    const { getByText, queryByText } = render(
      <Schedule date={new Date(2026, 8, 14)} appointments={appointments} />,
    );
    const titles = [getByText("Stand-up"), getByText("Design review")];
    expect(
      titles[0].compareDocumentPosition(titles[1]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(queryByText("Not shown")).toBeNull();
  });

  it("renders the description when provided", () => {
    const { getByText } = render(
      <Schedule date={new Date(2026, 8, 14)} appointments={appointments} />,
    );
    expect(getByText("Room 2B")).toBeInTheDocument();
  });

  it("shows the empty label when there are no appointments", () => {
    const { getByText } = render(
      <Schedule date={new Date(2026, 8, 20)} appointments={appointments} />,
    );
    expect(getByText("No appointments")).toBeInTheDocument();
  });

  it("renders a back button and calls onBack when clicked", () => {
    const onBack = vi.fn();
    const { getByRole } = render(
      <Schedule date={new Date(2026, 8, 14)} appointments={appointments} onBack={onBack} />,
    );
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("renders no back button when onBack is omitted", () => {
    const { queryByRole } = render(
      <Schedule date={new Date(2026, 8, 14)} appointments={appointments} />,
    );
    expect(queryByRole("button", { name: "Back" })).toBeNull();
  });
});
