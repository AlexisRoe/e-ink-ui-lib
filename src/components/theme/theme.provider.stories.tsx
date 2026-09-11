import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./theme.provider";

/**
 * Demo consumer that reads `useTheme()` and shows the `cx()` helper toggling
 * modifier classes on a button in response to state.
 */
function ThemeDemo() {
  const { themeApplied, cx } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <p>themeApplied: {String(themeApplied)}</p>
      <button
        type="button"
        disabled={disabled}
        className={cx(
          "eink-button",
          ["eink-button--pressed", pressed],
          ["eink-button--disabled", disabled],
        )}
        onClick={() => setPressed((value) => !value)}
      >
        {pressed ? "Pressed" : "Not pressed"}
      </button>
      <label style={{ display: "block", marginTop: 8 }}>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />
        Disabled
      </label>
    </div>
  );
}

const meta = {
  title: "Theme/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`ThemeProvider` loads the base e-ink stylesheet and exposes theme context " +
          "(`themeApplied` and the `cx` class-name helper) to descendants via `useTheme()`. " +
          "Wrap your application root with it once.",
      },
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <ThemeDemo />,
  },
};
