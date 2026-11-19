import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Inverted } from "./inverted.component";

describe("Inverted", () => {
  it("applies the inverted modifier by default", () => {
    render(<Inverted data-testid="s">x</Inverted>);
    expect(screen.getByTestId("s")).toHaveClass("eink-inverted", "eink-inverted--active");
  });

  it("renders plain when inactive and keeps custom class names", () => {
    render(
      <Inverted data-testid="s" active={false} className="custom">
        x
      </Inverted>,
    );
    expect(screen.getByTestId("s")).not.toHaveClass("eink-inverted--active");
    expect(screen.getByTestId("s")).toHaveClass("custom");
  });
});
