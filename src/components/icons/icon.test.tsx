import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import { iconNames } from "./icons";

describe("Icon", () => {
  it("renders the icon matching the given name", () => {
    const { container } = render(<Icon name="search" data-testid="icon" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("forwards svg props such as size", () => {
    const { container } = render(<Icon name="home" size={32} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "32");
  });

  it("has a component registered for every icon name", () => {
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    }
  });
});
