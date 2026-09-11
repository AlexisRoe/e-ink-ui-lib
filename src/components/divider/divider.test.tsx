import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider.component";

describe("Divider", () => {
  it("renders an hr with the eink-divider class", () => {
    const { container } = render(<Divider />);
    const divider = container.firstChild as HTMLElement;
    expect(divider.tagName).toBe("HR");
    expect(divider.className).toContain("eink-divider");
  });

  it("merges a custom className", () => {
    const { container } = render(<Divider className="custom" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider.className).toContain("eink-divider");
    expect(divider.className).toContain("custom");
  });
});
