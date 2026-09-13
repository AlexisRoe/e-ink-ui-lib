import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CalendarAppointment } from "../../utils/calendar.utils";
import { Calendar } from "./calendar.component";

const today = new Date(2026, 8, 13); // September 13, 2026

const appointments: CalendarAppointment[] = [
  { id: "standup", date: "2026-09-13", time: "09:00", title: "Stand-up" },
  { id: "review", date: "2026-09-13", time: "14:00", title: "Review" },
  { id: "other", date: "2026-09-20", time: "10:00", title: "Other" },
];

describe("Calendar", () => {
  it("opens on the month view for today", () => {
    const { getByText } = render(<Calendar today={today} />);
    expect(getByText("September 2026")).toBeInTheDocument();
  });

  it("highlights today", () => {
    const { getByText } = render(<Calendar today={today} />);
    expect(getByText("13").closest("button")).toHaveClass("eink-calendar__day--today");
  });

  it("shows an appointment count indicator on days with appointments", () => {
    const { getByText } = render(<Calendar today={today} appointments={appointments} />);
    expect(getByText("13").closest("button")).toHaveTextContent("2");
  });

  it("navigates to the previous and next month", () => {
    const { getByText, getByRole } = render(<Calendar today={today} />);
    fireEvent.click(getByRole("button", { name: "Next" }));
    expect(getByText("October 2026")).toBeInTheDocument();
    fireEvent.click(getByRole("button", { name: "Previous" }));
    fireEvent.click(getByRole("button", { name: "Previous" }));
    expect(getByText("August 2026")).toBeInTheDocument();
  });

  it("opens the day schedule when a day is clicked and can go back", () => {
    const { getByText, getByRole, queryByText } = render(
      <Calendar today={today} appointments={appointments} />,
    );
    fireEvent.click(getByText("13"));
    expect(getByText("Stand-up")).toBeInTheDocument();
    expect(getByText("Review")).toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(queryByText("Stand-up")).toBeNull();
    expect(getByText("September 2026")).toBeInTheDocument();
  });

  it("switches to the year view and back to a chosen month", () => {
    const { getByText, getByRole } = render(<Calendar today={today} />);
    fireEvent.click(getByText("September 2026"));
    expect(getByText("2026")).toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "December" }));
    expect(getByText("December 2026")).toBeInTheDocument();
  });
});
