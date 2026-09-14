import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Page } from "./page.component";

function renderPage(props: Partial<ComponentProps<typeof Page>> = {}) {
  return render(
    <Page {...props}>
      <Page.Header>
        <Page.NavToggle />
        Header
      </Page.Header>
      <Page.Nav>
        <Page.NavCloseButton />
        <a href="/first">First link</a>
        <a href="/second">Second link</a>
        Navigation
      </Page.Nav>
      <Page.Body>Body</Page.Body>
      <Page.Footer>Footer</Page.Footer>
    </Page>,
  );
}

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(event: { matches: boolean }) => void> = [];
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_event: string, listener: (event: { matches: boolean }) => void) => {
      listeners.push(listener);
    },
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  return listeners;
}

describe("Page", () => {
  afterEach(() => {
    // @ts-expect-error -- restoring jsdom's default (no matchMedia) between tests
    delete window.matchMedia;
    document.body.style.overflow = "";
  });

  it("renders header, nav, body, and footer landmarks", () => {
    renderPage();
    expect(screen.getByRole("banner")).toHaveTextContent("Header");
    expect(screen.getByRole("navigation")).toHaveTextContent("Navigation");
    expect(screen.getByRole("main")).toHaveTextContent("Body");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Footer");
  });

  it("has the nav open by default", () => {
    renderPage();
    expect(screen.getByRole("navigation")).toBeVisible();
    expect(screen.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("starts closed when defaultNavOpen is false", () => {
    renderPage({ defaultNavOpen: false });
    expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();
  });

  it("toggles the nav open state when Page.NavToggle is clicked", () => {
    renderPage();
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });

    fireEvent.click(toggle);
    expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(screen.getByRole("navigation")).toBeVisible();
  });

  it("closes the nav when Page.NavCloseButton is clicked", () => {
    const { container } = renderPage();
    const closeButton = container.querySelector<HTMLButtonElement>(".eink-page__nav-close");
    expect(closeButton).not.toBeNull();

    fireEvent.click(closeButton as HTMLButtonElement);
    expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();
  });

  it("renders a border on the header and footer by default", () => {
    renderPage();
    expect(screen.getByRole("banner")).toHaveClass("eink-page__header--border");
    expect(screen.getByRole("contentinfo")).toHaveClass("eink-page__footer--border");
  });

  it("omits the border when withBorder is false", () => {
    render(
      <Page>
        <Page.Header withBorder={false}>Header</Page.Header>
        <Page.Nav>Navigation</Page.Nav>
        <Page.Body>Body</Page.Body>
        <Page.Footer withBorder={false}>Footer</Page.Footer>
      </Page>,
    );
    expect(screen.getByRole("banner")).not.toHaveClass("eink-page__header--border");
    expect(screen.getByRole("contentinfo")).not.toHaveClass("eink-page__footer--border");
  });

  it("throws when Page.Nav subcomponents are used outside of a Page", () => {
    expect(() => render(<Page.NavToggle />)).toThrow(
      /Page\.NavToggle can only be used inside a Page/,
    );
  });

  it("is controlled when navOpen is provided: clicking the toggle only calls onNavOpenChange", () => {
    const onNavOpenChange = vi.fn();
    const { rerender } = renderPage({ navOpen: false, onNavOpenChange });

    expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
    expect(onNavOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();

    rerender(
      <Page navOpen onNavOpenChange={onNavOpenChange}>
        <Page.Header>
          <Page.NavToggle />
          Header
        </Page.Header>
        <Page.Nav>
          <Page.NavCloseButton />
          Navigation
        </Page.Nav>
        <Page.Body>Body</Page.Body>
        <Page.Footer>Footer</Page.Footer>
      </Page>,
    );
    expect(screen.getByRole("navigation")).toBeVisible();
  });

  it('renders Page.Nav as a slim icon rail instead of hiding it when folded with collapsedMode="rail"', () => {
    renderPage({ defaultNavOpen: false, collapsedMode: "rail" });

    const nav = screen.getByRole("navigation");
    expect(nav).toBeVisible();
    expect(nav).toHaveClass("eink-page__nav--rail");
  });

  describe("on mobile", () => {
    it("moves focus to the close button when opened, and back to the toggle when closed", () => {
      mockMatchMedia(true);
      const { container } = renderPage({ defaultNavOpen: false });

      const toggle = screen.getByRole("button", { name: "Toggle navigation" });
      fireEvent.click(toggle);

      const closeButton = container.querySelector<HTMLButtonElement>(".eink-page__nav-close");
      expect(closeButton).toHaveFocus();

      fireEvent.click(closeButton as HTMLButtonElement);
      expect(toggle).toHaveFocus();
    });

    it("closes on Escape", () => {
      mockMatchMedia(true);
      renderPage({ defaultNavOpen: false });

      fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
      expect(screen.getByRole("navigation")).toBeVisible();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.getByRole("navigation", { hidden: true })).not.toBeVisible();
    });

    it("locks and restores body scroll while open", () => {
      mockMatchMedia(true);
      const { container } = renderPage({ defaultNavOpen: false });

      fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
      expect(document.body.style.overflow).toBe("hidden");

      const closeButton = container.querySelector<HTMLButtonElement>(".eink-page__nav-close");
      fireEvent.click(closeButton as HTMLButtonElement);
      expect(document.body.style.overflow).toBe("");
    });

    it("traps Tab focus inside the open nav", () => {
      mockMatchMedia(true);
      const { container } = renderPage({ defaultNavOpen: false });

      fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));

      const closeButton = container.querySelector<HTMLButtonElement>(".eink-page__nav-close");
      const lastLink = screen.getByRole("link", { name: "Second link" });

      lastLink.focus();
      fireEvent.keyDown(document, { key: "Tab" });
      expect(closeButton).toHaveFocus();

      closeButton?.focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
      expect(lastLink).toHaveFocus();
    });
  });
});
