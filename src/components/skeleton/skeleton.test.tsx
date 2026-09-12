import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton.component";

describe("Skeleton", () => {
  it("renders the rectangle variant by default", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveClass("eink-skeleton--rectangle");
  });

  it("renders the round variant", () => {
    render(<Skeleton variant="round" />);
    expect(screen.getByRole("status")).toHaveClass("eink-skeleton--round");
  });

  it("renders the square variant", () => {
    render(<Skeleton variant="square" />);
    expect(screen.getByRole("status")).toHaveClass("eink-skeleton--square");
  });

  it("forwards style and className for sizing", () => {
    render(<Skeleton className="custom" style={{ height: 120 }} />);
    const skeleton = screen.getByRole("status");
    expect(skeleton).toHaveClass("custom");
    expect(skeleton).toHaveStyle({ height: "120px" });
  });
});
