import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion } from "./accordion.component";

describe("Accordion.Item", () => {
  it("renders as a <details>/<summary> element", () => {
    render(<Accordion.Item summary="Shipping">Ships in 3 days.</Accordion.Item>);
    const summary = screen.getByText("Shipping");
    expect(summary.tagName).toBe("SPAN");
    expect(summary.closest("summary")).not.toBeNull();
    expect(summary.closest("details")).not.toBeNull();
  });

  it("is closed by default when rendered standalone", () => {
    render(<Accordion.Item summary="Shipping">Ships in 3 days.</Accordion.Item>);
    expect(screen.getByText("Shipping").closest("details")).not.toHaveAttribute("open");
  });

  it("is open by default when openByDefault is true", () => {
    render(
      <Accordion.Item summary="Shipping" openByDefault>
        Ships in 3 days.
      </Accordion.Item>,
    );
    expect(screen.getByText("Shipping").closest("details")).toHaveAttribute("open");
  });

  it("toggles open state when the summary is clicked", () => {
    render(<Accordion.Item summary="Shipping">Ships in 3 days.</Accordion.Item>);
    const details = screen.getByText("Shipping").closest("details") as HTMLDetailsElement;
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(screen.getByText("Shipping"));
    expect(details).toHaveAttribute("open");

    fireEvent.click(screen.getByText("Shipping"));
    expect(details).not.toHaveAttribute("open");
  });
});

describe("Accordion", () => {
  it("renders all items", () => {
    render(
      <Accordion>
        <Accordion.Item id="a" summary="A">
          Content A
        </Accordion.Item>
        <Accordion.Item id="b" summary="B">
          Content B
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("opens the item matching defaultOpenId", () => {
    render(
      <Accordion defaultOpenId="b">
        <Accordion.Item id="a" summary="A">
          Content A
        </Accordion.Item>
        <Accordion.Item id="b" summary="B">
          Content B
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText("A").closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("B").closest("details")).toHaveAttribute("open");
  });

  it("only keeps one item open at a time", () => {
    render(
      <Accordion>
        <Accordion.Item id="a" summary="A">
          Content A
        </Accordion.Item>
        <Accordion.Item id="b" summary="B">
          Content B
        </Accordion.Item>
      </Accordion>,
    );

    const detailsA = screen.getByText("A").closest("details") as HTMLDetailsElement;
    const detailsB = screen.getByText("B").closest("details") as HTMLDetailsElement;

    fireEvent.click(screen.getByText("A"));
    expect(detailsA).toHaveAttribute("open");
    expect(detailsB).not.toHaveAttribute("open");

    fireEvent.click(screen.getByText("B"));
    expect(detailsA).not.toHaveAttribute("open");
    expect(detailsB).toHaveAttribute("open");
  });
});
