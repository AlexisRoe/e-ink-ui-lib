import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tree } from "./tree.component";

describe("Tree", () => {
  it("renders top-level item labels", () => {
    const { getByText } = render(
      <Tree>
        <Tree.Item label="src" />
        <Tree.Item label="package.json" />
      </Tree>,
    );
    expect(getByText("src")).toBeInTheDocument();
    expect(getByText("package.json")).toBeInTheDocument();
  });

  it("renders nested item labels when expanded by default", () => {
    const { getByText } = render(
      <Tree>
        <Tree.Item label="src">
          <Tree.Item label="index.ts" />
        </Tree.Item>
      </Tree>,
    );
    expect(getByText("index.ts")).toBeInTheDocument();
  });

  it("renders a branch as a toggle button and a leaf as plain text", () => {
    const { getByRole, getByText } = render(
      <Tree>
        <Tree.Item label="src">
          <Tree.Item label="index.ts" />
        </Tree.Item>
      </Tree>,
    );
    expect(getByRole("button", { name: /src/ })).toBeInTheDocument();
    expect(getByText("index.ts").closest("button")).toBeNull();
  });

  it("hides nested items when initialExpanded is false", () => {
    const { queryByText } = render(
      <Tree>
        <Tree.Item label="src" initialExpanded={false}>
          <Tree.Item label="index.ts" />
        </Tree.Item>
      </Tree>,
    );
    expect(queryByText("index.ts")).toBeNull();
  });

  it("toggles nested items on click", () => {
    const { getByRole, queryByText } = render(
      <Tree>
        <Tree.Item label="src" initialExpanded={false}>
          <Tree.Item label="index.ts" />
        </Tree.Item>
      </Tree>,
    );
    const toggle = getByRole("button", { name: /src/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(queryByText("index.ts")).not.toBeNull();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(queryByText("index.ts")).toBeNull();
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Tree className="custom">
        <Tree.Item label="src" />
      </Tree>,
    );
    expect(container.querySelector(".eink-tree")).toHaveClass("custom");
  });
});
