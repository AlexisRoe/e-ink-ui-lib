import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Space } from "./Space.component";

describe("Space", () => {
  it("defaults to size 16", () => {
    const { container } = render(<Space data-testid="space" />);
    const space = container.firstChild as HTMLElement;
    expect(space.style.getPropertyValue("--eink-space-size")).toBe("var(--eink-size-16)");
  });

  it("applies the requested size token", () => {
    const { container } = render(<Space size={64} />);
    const space = container.firstChild as HTMLElement;
    expect(space.style.getPropertyValue("--eink-space-size")).toBe("var(--eink-size-64)");
  });
});
