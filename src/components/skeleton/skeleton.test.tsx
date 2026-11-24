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

  describe("Skeleton.Group", () => {
    it("announces one status region with the default of three skeletons", () => {
      const { container } = render(<Skeleton.Group aria-label="Loading lessons" />);
      expect(screen.getAllByRole("status")).toHaveLength(1);
      expect(screen.getByRole("status", { name: "Loading lessons" })).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(container.querySelectorAll(".eink-skeleton")).toHaveLength(3);
    });

    it("renders `count` skeletons", () => {
      const { container } = render(<Skeleton.Group count={5} />);
      expect(container.querySelectorAll(".eink-skeleton")).toHaveLength(5);
    });

    it("renders custom children instead of the default skeletons", () => {
      const { container } = render(
        <Skeleton.Group>
          <Skeleton variant="round" />
        </Skeleton.Group>,
      );
      expect(container.querySelectorAll(".eink-skeleton")).toHaveLength(1);
      expect(container.querySelector(".eink-skeleton--round")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });
});
