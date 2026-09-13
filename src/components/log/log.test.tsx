import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Log } from "./log.component";

const timeStamp = new Date(2026, 0, 1, 11, 31, 44, 0);

describe("Log", () => {
  it("renders the title when provided", () => {
    const { getByText } = render(
      <Log title="Line 2">
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(getByText("Line 2")).toBeInTheDocument();
  });

  it("renders no title element when omitted", () => {
    const { container } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log__title")).toBeNull();
  });

  it("applies the bordered entries class by default", () => {
    const { container } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log__entries")).toHaveClass(
      "eink-log__entries--bordered",
    );
  });

  it("omits the bordered entries class when withBorder is false", () => {
    const { container } = render(
      <Log withBorder={false}>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log__entries")).not.toHaveClass(
      "eink-log__entries--bordered",
    );
  });

  it("renders no border-top CSS on items when withBorder is false", () => {
    const { container } = render(
      <Log withBorder={false}>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
        <Log.Item state="warning" timeStamp={timeStamp}>
          Torque above tolerance
        </Log.Item>
      </Log>,
    );
    const items = container.querySelectorAll(".eink-log-item");
    for (const item of items) {
      expect(getComputedStyle(item).borderTopStyle).toBe("none");
    }
  });

  it("renders each item's children", () => {
    const { getByText } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
        <Log.Item state="error" timeStamp={timeStamp}>
          Cycle aborted
        </Log.Item>
      </Log>,
    );
    expect(getByText("Batch started")).toBeInTheDocument();
    expect(getByText("Cycle aborted")).toBeInTheDocument();
  });

  it("formats the timestamp as hh:mm:ss:ms", () => {
    const { getByText } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(getByText("11:31:44:000")).toBeInTheDocument();
  });

  it("renders the source when provided", () => {
    const { getByText } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp} source="LINE-2">
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(getByText("LINE-2")).toBeInTheDocument();
  });

  it("renders no source element when omitted", () => {
    const { container } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log-item__source")).toBeNull();
  });

  it("renders the ACK box when ack is true", () => {
    const { getByText } = render(
      <Log>
        <Log.Item state="error" timeStamp={timeStamp} ack>
          Cycle aborted
        </Log.Item>
      </Log>,
    );
    expect(getByText("ACK")).toBeInTheDocument();
  });

  it("renders no ACK box by default", () => {
    const { container } = render(
      <Log>
        <Log.Item state="error" timeStamp={timeStamp}>
          Cycle aborted
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log-item__ack")).toBeNull();
  });

  it("renders a diagonal-line marker for critical state", () => {
    const { container } = render(
      <Log>
        <Log.Item state="critical" timeStamp={timeStamp}>
          Safety guard opened
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector("svg.eink-log-item__marker")).not.toBeNull();
  });

  it("renders a filled marker for warning and error states", () => {
    const { container } = render(
      <Log>
        <Log.Item state="warning" timeStamp={timeStamp}>
          Torque above tolerance
        </Log.Item>
        <Log.Item state="error" timeStamp={timeStamp}>
          Cycle aborted
        </Log.Item>
      </Log>,
    );
    const markers = container.querySelectorAll(".eink-log-item__marker");
    expect(markers[0]).toHaveClass("eink-log-item__marker--warning");
    expect(markers[1]).toHaveClass("eink-log-item__marker--error");
  });

  it("renders no fill modifier for info state", () => {
    const { container } = render(
      <Log>
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    const marker = container.querySelector(".eink-log-item__marker");
    expect(marker).not.toHaveClass("eink-log-item__marker--warning");
    expect(marker).not.toHaveClass("eink-log-item__marker--error");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Log className="custom">
        <Log.Item state="info" timeStamp={timeStamp}>
          Batch started
        </Log.Item>
      </Log>,
    );
    expect(container.querySelector(".eink-log")).toHaveClass("custom");
  });
});
