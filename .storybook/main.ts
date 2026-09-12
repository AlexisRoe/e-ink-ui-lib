import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  core: {
    disableWhatsNewNotifications: true,
  },
  features: {
    menuOnboardingChecklist: false,
    sidebarOnboardingChecklist: false,
  },
};
export default config;
