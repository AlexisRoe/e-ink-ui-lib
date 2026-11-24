import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useNotifications } from "../notification/notification.provider";
import { useTheme } from "../theme/theme.provider";
import { EinkProvider } from "./provider.component";

function Probe() {
  const { themeApplied } = useTheme();
  const { notify } = useNotifications();
  return (
    <button type="button" onClick={() => notify("Hello")}>
      {themeApplied ? "themed" : "plain"}
    </button>
  );
}

describe("EinkProvider", () => {
  it("provides theme and notifications to its children", () => {
    render(
      <EinkProvider>
        <Probe />
      </EinkProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("themed");
  });

  it("provides the modal root", () => {
    render(
      <EinkProvider>
        <p>content</p>
      </EinkProvider>,
    );
    expect(document.querySelector("[data-eink-modal-root]")).not.toBeNull();
  });
});
