import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationProvider, useNotifications } from "./notification.provider";

function Demo() {
  const { notify } = useNotifications();
  return (
    <>
      <button type="button" onClick={() => notify("Saved", "Your changes have been saved.")}>
        Fire
      </button>
      <button type="button" onClick={() => notify("Careful", "Check your input.", "warning")}>
        Fire warning
      </button>
      <button type="button" onClick={() => notify("Failed", "Please try again.", "error")}>
        Fire error
      </button>
    </>
  );
}

describe("NotificationProvider / useNotifications", () => {
  it("does nothing when notify is called without an ancestor NotificationProvider", () => {
    render(<Demo />);
    fireEvent.click(screen.getByText("Fire"));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("renders the title and description when a notification is fired", () => {
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes have been saved.")).toBeInTheDocument();
  });

  it("dismisses the notification after the configured duration", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("stacks multiple notifications fired while others are still visible", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    fireEvent.click(screen.getByText("Fire"));

    expect(screen.getAllByText("Saved")).toHaveLength(2);
    vi.useRealTimers();
  });

  it("closes every visible notification at once when the last one's timer elapses", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    fireEvent.click(screen.getByText("Fire"));
    expect(screen.getAllByText("Saved")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getAllByText("Saved")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("defaults to the info variant", () => {
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire"));
    expect(document.querySelector(".eink-notification__bar--info")).toBeInTheDocument();
  });

  it("renders the warning variant with a diagonal pattern bar", () => {
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire warning"));
    const bar = document.querySelector(".eink-notification__bar--warning");
    expect(bar).toBeInTheDocument();
    expect(bar?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the error variant with a solid bar", () => {
    render(
      <NotificationProvider duration={1000}>
        <Demo />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText("Fire error"));
    expect(document.querySelector(".eink-notification__bar--error")).toBeInTheDocument();
  });
});
