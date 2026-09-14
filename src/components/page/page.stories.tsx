import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navigation } from "../navigation/navigation.component";
import { Text } from "../text/text.component";
import { Title } from "../title/title.component";
import { Page } from "./page.component";

const meta = {
  title: "Components/Layout/Page",
  component: Page,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          `Full-page layout composite built from ` +
          "`Page.Header`, `Page.Nav`, `Page.Body`, and `Page.Footer`, " +
          "arranged with CSS grid.\n\n" +
          "- `Page.Header` and `Page.Footer` are sticky, pinned to the " +
          "top/bottom of the viewport.\n" +
          "- `Page.Body` scrolls independently.\n" +
          '- `Page.Nav` sits on `navSide` (`"left"` or `"right"`), has ' +
          "a light grey background by default, or plain white via `mono`.\n" +
          "- `Page.NavToggle` (placed in the header) folds `Page.Nav` " +
          "open/closed on desktop and tablet.\n" +
          "- On mobile, `Page.Nav` is hidden by default; opening it covers " +
          "the full screen, traps focus, locks background scroll, and " +
          "closes on Escape or `Page.NavCloseButton` (placed inside " +
          "`Page.Nav`), returning focus to `Page.NavToggle`.\n" +
          "- `navOpen`/`onNavOpenChange` make the nav a controlled prop, " +
          "for syncing it with, e.g., a router.\n" +
          '- `collapsedMode="rail"` (on `Page`) keeps a slim icon-only rail ' +
          "visible when folded on desktop/tablet, instead of hiding it.\n\n" +
          "This composite fills the viewport, so the Storybook canvas is " +
          "too small to show it properly — open a story's canvas in its " +
          "own browser tab (canvas toolbar, top-right icon) and resize " +
          "that window to see the tablet and mobile breakpoints.",
      },
    },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

function ExamplePage() {
  return (
    <Page navSide="left">
      <Page.Header>
        <Page.NavToggle />
        <Title size={2}>E-Ink Library</Title>
      </Page.Header>
      <Page.Nav>
        <Page.NavCloseButton />
        <Navigation withBorder={false} fullWidth>
          <Navigation.Item target="/" icon="home" label="Home" />
          <Navigation.Item target="/components" icon="layout-grid" label="Components" />
          <Navigation.Item target="/settings" icon="settings" label="Settings" />
        </Navigation>
      </Page.Nav>
      <Page.Body>
        <Title>Page body</Title>
        <Text>
          This area scrolls independently while the header, footer, and navigation stay put. Resize
          the browser window to see the desktop, tablet, and mobile breakpoints — on mobile the
          navigation is hidden until opened, and then covers the full screen.
        </Text>
        {Array.from({ length: 40 }, (_, index) => `Content row ${index + 1}`).map((row) => (
          <Text key={row}>{row}</Text>
        ))}
      </Page.Body>
      <Page.Footer>
        <Text>Footer content</Text>
      </Page.Footer>
    </Page>
  );
}

/**
 * `Page` fills the viewport (`100vh`), so the Storybook canvas is far too
 * small to show its sticky header/footer, scrollable body, and foldable
 * navigation behaving correctly — and too small to reach the tablet/mobile
 * breakpoints. Use the canvas toolbar's "Open canvas in new tab" icon
 * (top-right, looks like a diagonal arrow) on this story to open it in its
 * own browser tab, then resize that window/tab to see it respond across
 * desktop, tablet, and mobile.
 */
export const Default: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
  },
  render: () => <ExamplePage />,
};

/** Navigation on the right side, with a plain white (`mono`) background. */
export const NavRightMono: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <Page navSide="right">
      <Page.Header>
        <Title size={2}>E-Ink Library</Title>
        <Page.NavToggle />
      </Page.Header>
      <Page.Nav mono>
        <Page.NavCloseButton />
        <Navigation withBorder={false} fullWidth>
          <Navigation.Item target="/" icon="home" label="Home" />
          <Navigation.Item target="/settings" icon="settings" label="Settings" />
        </Navigation>
      </Page.Nav>
      <Page.Body>
        <Text>Body content, with the navigation folded to the right.</Text>
      </Page.Body>
      <Page.Footer>
        <Text>Footer content</Text>
      </Page.Footer>
    </Page>
  ),
};

/**
 * With `collapsedMode="rail"`, folding the nav via `Page.NavToggle` on
 * desktop/tablet leaves a slim icon-only rail visible instead of hiding it
 * completely — useful for e-ink dashboards where a fully-hidden nav is one
 * extra tap away too often.
 */
export const CollapsedRail: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <Page navSide="left" collapsedMode="rail" defaultNavOpen={false}>
      <Page.Header>
        <Page.NavToggle />
        <Title size={2}>E-Ink Library</Title>
      </Page.Header>
      <Page.Nav>
        <Page.NavCloseButton />
        <Navigation withBorder={false} fullWidth>
          <Navigation.Item target="/" icon="home" label="Home" />
          <Navigation.Item target="/components" icon="layout-grid" label="Components" />
          <Navigation.Item target="/settings" icon="settings" label="Settings" />
        </Navigation>
      </Page.Nav>
      <Page.Body>
        <Text>
          The nav starts folded to its icon rail. Click the header's menu button to expand it to
          full width.
        </Text>
      </Page.Body>
      <Page.Footer>
        <Text>Footer content</Text>
      </Page.Footer>
    </Page>
  ),
};
