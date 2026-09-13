import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./timeline.component";

describe("Timeline", () => {
  it("renders items with time, title, and description", () => {
    render(
      <Timeline>
        <Timeline.Item time="08:30" title="Stand-up" state="done">
          Daily sync.
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByText("08:30")).toBeInTheDocument();
    expect(screen.getByText("Stand-up")).toBeInTheDocument();
    expect(screen.getByText("Daily sync.")).toBeInTheDocument();
  });

  it("renders a filled marker for the done state", () => {
    render(
      <Timeline>
        <Timeline.Item time="08:30" title="Stand-up" state="done">
          Daily sync.
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByLabelText("done")).toHaveClass("eink-timeline-item__box--done");
  });

  it("renders a hatched svg marker for the pending state", () => {
    render(
      <Timeline>
        <Timeline.Item time="11:00" title="Review" state="pending">
          In progress.
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByLabelText("pending").tagName).toBe("svg");
  });

  it("renders an empty marker for the todo state", () => {
    render(
      <Timeline>
        <Timeline.Item time="17:30" title="Postmortem" state="todo">
          Pending writeup.
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByLabelText("todo")).not.toHaveClass("eink-timeline-item__box--done");
  });

  it("applies the base class and merges a custom className", () => {
    const { container } = render(
      <Timeline className="custom">
        <Timeline.Item time="08:30" title="Stand-up" state="done">
          Daily sync.
        </Timeline.Item>
      </Timeline>,
    );
    expect(container.firstElementChild).toHaveClass("eink-timeline", "custom");
  });
});
