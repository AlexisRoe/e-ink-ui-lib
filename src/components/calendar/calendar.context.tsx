import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

/** Which layer of the calendar is currently rendered. */
export type CalendarView = "year" | "month" | "day";

/** Value exposed by the internal {@link CalendarContext}. */
export interface CalendarContextValue {
  /** Layer currently rendered: the year grid, the month grid, or a single day's schedule. */
  view: CalendarView;
  /** Year/month currently being browsed (day-of-month is not meaningful). */
  focusedDate: Date;
  /** Day selected for the `"day"` view, or `null` when not in that view. */
  selectedDate: Date | null;
  /** Today's date, fixed for the lifetime of the provider. */
  today: Date;
  /** Steps `focusedDate` one unit back: a year in year view, a month in month view. */
  goToPrevious: () => void;
  /** Steps `focusedDate` one unit forward: a year in year view, a month in month view. */
  goToNext: () => void;
  /** Resets `focusedDate` to today and returns to the month view. */
  goToToday: () => void;
  /** Switches to the year view. */
  showYear: () => void;
  /** Switches to the month view. */
  showMonth: () => void;
  /** Selects `date` and switches to the day view. */
  selectDay: (date: Date) => void;
  /** Selects `month` (0-indexed) within the focused year and switches to the month view. */
  selectMonth: (month: number) => void;
  /** Leaves the day view and returns to the month view. */
  backToMonth: () => void;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

/** Props accepted by the internal {@link CalendarProvider}. */
export interface CalendarProviderProps {
  /** Date used to determine "today" and the initially focused month. Defaults to `new Date()`. */
  initialDate?: Date;
  children: ReactNode;
}

/**
 * Internal state container for {@link Calendar}. Not part of the public
 * API: {@link Calendar} mounts it once and every sub-view (year grid, month
 * grid, day schedule) reads and drives navigation through
 * {@link useCalendarContext}.
 */
export function CalendarProvider({ initialDate, children }: CalendarProviderProps) {
  const today = useMemo(() => initialDate ?? new Date(), [initialDate]);
  const [view, setView] = useState<CalendarView>("month");
  const [focusedDate, setFocusedDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPrevious = useCallback(() => {
    setFocusedDate((current) => {
      if (view === "year") return new Date(current.getFullYear() - 1, current.getMonth(), 1);
      return new Date(current.getFullYear(), current.getMonth() - 1, 1);
    });
  }, [view]);

  const goToNext = useCallback(() => {
    setFocusedDate((current) => {
      if (view === "year") return new Date(current.getFullYear() + 1, current.getMonth(), 1);
      return new Date(current.getFullYear(), current.getMonth() + 1, 1);
    });
  }, [view]);

  const goToToday = useCallback(() => {
    setFocusedDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(null);
    setView("month");
  }, [today]);

  const showYear = useCallback(() => setView("year"), []);
  const showMonth = useCallback(() => setView("month"), []);

  const selectDay = useCallback((date: Date) => {
    setSelectedDate(date);
    setView("day");
  }, []);

  const selectMonth = useCallback((month: number) => {
    setFocusedDate((current) => new Date(current.getFullYear(), month, 1));
    setView("month");
  }, []);

  const backToMonth = useCallback(() => {
    setSelectedDate(null);
    setView("month");
  }, []);

  const value = useMemo<CalendarContextValue>(
    () => ({
      view,
      focusedDate,
      selectedDate,
      today,
      goToPrevious,
      goToNext,
      goToToday,
      showYear,
      showMonth,
      selectDay,
      selectMonth,
      backToMonth,
    }),
    [
      view,
      focusedDate,
      selectedDate,
      today,
      goToPrevious,
      goToNext,
      goToToday,
      showYear,
      showMonth,
      selectDay,
      selectMonth,
      backToMonth,
    ],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

/** Reads the internal {@link CalendarContext}. Throws outside a {@link Calendar}. */
export function useCalendarContext(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a Calendar");
  }
  return context;
}
