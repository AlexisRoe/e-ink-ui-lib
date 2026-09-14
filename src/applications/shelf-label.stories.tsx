import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "../components/container/container.component";
import { Description } from "../components/description/description.component";
import { Flex } from "../components/flex/flex.component";
import { Label } from "../components/label/label.component";
import { Pill } from "../components/pill/pill.component";
import { Price } from "../components/price/price.component";
import { QRCode } from "../components/qrcode/qrcode.component";
import { Title } from "../components/title/title.component";

/**
 * Example composition: an electronic shelf label for a coffee product,
 * combining `Title`/`Description` for product info, `Price`, `Pill`s for
 * badges, and a `QRCode` linking to the product page.
 */
const meta = {
  title: "Applications/Shelf Label",
  component: Container,
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Container withBorder style={{ width: 900, padding: "1rem" }}>
      <Flex align="center" justify="space-between" gap="xl">
        <Flex column gap="sm">
          <Label>Coffee · Whole Bean</Label>
          <Title size={2}>Ethiopia Yirgacheffe</Title>
          <Flex gap="sm" wrap>
            <Pill icon="star">Single origin</Pill>
            <Pill.Double icon="check">Organic</Pill.Double>
          </Flex>
        </Flex>
        <Flex column gap="sm">
          <Description label="Origin" value="Gedeo Zone, Ethiopia" />
          <Description label="Roast" value="Light-Medium" />
        </Flex>
        <Price value={14.9} currency="€" size="xl" separatorStyle="eu" />
        <QRCode
          value={{ type: "url", url: "https://example.com/products/yirgacheffe" }}
          label="Product info"
          width={96}
        />
      </Flex>
    </Container>
  ),
};
