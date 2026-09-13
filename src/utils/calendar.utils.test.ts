import { describe, expect, it } from "vitest";
import {
  type CalendarAppointment,
  getAppointmentsForDate,
  getMonthGrid,
  groupAppointmentsByDate,
  isSameDay,
  isSameMonth,
  parseDateKey,
  toDateKey,
} from "./calendar.utils";

describe("toDateKey / parseDateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("round-trips through parseDateKey", () => {
    const date = parseDateKey("2026-09-14");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(14);
  });
});

describe("isSameDay", () => {
  it("is true for the same calendar day", () => {
    expect(isSameDay(new Date(2026, 8, 13, 1), new Date(2026, 8, 13, 23))).toBe(true);
  });

  it("is false for different days", () => {
    expect(isSameDay(new Date(2026, 8, 13), new Date(2026, 8, 14))).toBe(false);
  });
});

describe("isSameMonth", () => {
  it("is true for dates in the same month and year", () => {
    expect(isSameMonth(new Date(2026, 8, 1), new Date(2026, 8, 30))).toBe(true);
  });

  it("is false across a year boundary", () => {
    expect(isSameMonth(new Date(2025, 8, 1), new Date(2026, 8, 1))).toBe(false);
  });
});

describe("getMonthGrid", () => {
  it("returns 42 days", () => {
    expect(getMonthGrid(2026, 8)).toHaveLength(42);
  });

  it("starts on a Monday", () => {
    const [first] = getMonthGrid(2026, 8);
    expect(first.getDay()).toBe(1);
  });

  it("includes every day of the month", () => {
    const grid = getMonthGrid(2026, 1); // February 2026, 28 days
    const daysInMonth = grid.filter((date) => date.getMonth() === 1);
    expect(daysInMonth).toHaveLength(28);
  });
});

describe("groupAppointmentsByDate / getAppointmentsForDate", () => {
  const appointments: CalendarAppointment[] = [
    { id: "1", date: "2026-09-14", time: "14:00", title: "Late" },
    { id: "2", date: "2026-09-14", time: "09:00", title: "Early" },
    { id: "3", date: "2026-09-15", time: "10:00", title: "Next day" },
  ];

  it("groups appointments by date key", () => {
    const groups = groupAppointmentsByDate(appointments);
    expect(groups.get("2026-09-14")).toHaveLength(2);
    expect(groups.get("2026-09-15")).toHaveLength(1);
  });

  it("sorts each group by time", () => {
    const groups = groupAppointmentsByDate(appointments);
    expect(groups.get("2026-09-14")?.map((a) => a.id)).toEqual(["2", "1"]);
  });

  it("returns sorted appointments for a given date", () => {
    const result = getAppointmentsForDate(appointments, new Date(2026, 8, 14));
    expect(result.map((a) => a.id)).toEqual(["2", "1"]);
  });

  it("returns an empty array when no appointments match", () => {
    expect(getAppointmentsForDate(appointments, new Date(2026, 8, 20))).toEqual([]);
  });
});
