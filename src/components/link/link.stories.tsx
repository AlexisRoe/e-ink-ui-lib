import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link.component";

const meta = {
  title: "Components/Actions/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    href: "https://example.com",
    children: "Example link",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: {
    external: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `external` is true, the link opens in a new tab with `rel="noopener noreferrer"` and shows the tabler `external-link` icon in front of the text.',
      },
    },
  },
};

export const AlreadyClicked: Story = {
  args: {
    alreadyClicked: true,
  },
};

export const InParagraph: Story = {
  render: ({ href, children }) => (
    <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
      This is a paragraph of body text that contains an{" "}
      <Link href={href} external>
        {children}
      </Link>{" "}
      right in the middle of the sentence, so you can check that the external-link icon lines up
      with the surrounding text instead of pushing it out of line.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The external-link icon is rendered larger than the default 14px, but the link stays vertically aligned with the surrounding paragraph text.",
      },
    },
  },
};
