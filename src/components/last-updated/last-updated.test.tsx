import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LastUpdated } from "./last-updated.component";

describe("LastUpdated", () => {
  const now = new Date("2026-01-01T00:10:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the child value", () => {
    const { getByText } = render(<LastUpdated date={now}>$42.00</LastUpdated>);
    expect(getByText("$42.00")).toBeInTheDocument();
  });

  it("defaults to fresh when just updated", () => {
    const { getByText } = render(<LastUpdated date={now}>value</LastUpdated>);
    expect(getByText("fresh")).toBeInTheDocument();
  });

  it("defaults to stale after 60 seconds", () => {
    const date = new Date(now.getTime() - 61_000);
    const { getByText } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(getByText("stale")).toBeInTheDocument();
  });

  it("defaults to expired after 300 seconds", () => {
    const date = new Date(now.getTime() - 301_000);
    const { getByText } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(getByText("expired")).toBeInTheDocument();
  });

  it("accepts custom stale and expired thresholds", () => {
    const date = new Date(now.getTime() - 45_000);
    const { getByText } = render(
      <LastUpdated date={date} stale={30} expired={60}>
        value
      </LastUpdated>,
    );
    expect(getByText("stale")).toBeInTheDocument();
  });

  it("overrides status labels", () => {
    const date = new Date(now.getTime() - 301_000);
    const { getByText } = render(
      <LastUpdated date={date} statusLabels={{ expired: "outdated" }}>
        value
      </LastUpdated>,
    );
    expect(getByText("outdated")).toBeInTheDocument();
  });

  it("renders a border by default", () => {
    const { container } = render(<LastUpdated date={now}>value</LastUpdated>);
    expect(container.firstChild).toHaveClass("eink-last-updated--border");
  });

  it("disables the border via withBorder", () => {
    const { container } = render(
      <LastUpdated date={now} withBorder={false}>
        value
      </LastUpdated>,
    );
    expect(container.firstChild).not.toHaveClass("eink-last-updated--border");
  });

  it("applies the status modifier class to the indicator row", () => {
    const date = new Date(now.getTime() - 301_000);
    const { container } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(container.querySelector(".eink-last-updated__status--expired")).not.toBeNull();
  });

  it("renders a diagonal pattern for the stale indicator", () => {
    const date = new Date(now.getTime() - 61_000);
    const { container } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(container.querySelector(".eink-last-updated__pattern")).not.toBeNull();
  });

  it("shows the singular minutes-ago text", () => {
    const date = new Date(now.getTime() - 60_000);
    const { getByText } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(getByText("1 minute ago")).toBeInTheDocument();
  });

  it("shows the plural minutes-ago text", () => {
    const date = new Date(now.getTime() - 300_000);
    const { getByText } = render(<LastUpdated date={date}>value</LastUpdated>);
    expect(getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("overrides the minutes-ago text via formatMinutesAgo", () => {
    const date = new Date(now.getTime() - 120_000);
    const { getByText } = render(
      <LastUpdated date={date} formatMinutesAgo={(minutes) => `updated ${minutes}m ago`}>
        value
      </LastUpdated>,
    );
    expect(getByText("updated 2m ago")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(
      <LastUpdated date={now} className="custom">
        value
      </LastUpdated>,
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});
