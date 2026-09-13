import type { Meta, StoryObj } from "@storybook/react-vite";
import { QRCode } from "./qrcode.component";

const meta = {
  title: "Components/Data Display/QRCode",
  component: QRCode,
  tags: ["autodocs"],
  argTypes: {
    width: { control: "number" },
    errorCorrectionLevel: {
      control: "select",
      options: ["L", "M", "Q", "H"],
    },
    quietZone: { control: "number" },
  },
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Url: Story = {
  args: {
    value: { type: "url", url: "https://example.com" },
    label: "example.com",
    width: 160,
  },
};

export const PlainText: Story = {
  args: {
    value: "Gate 12B, boards 09:40",
    label: "Boarding pass",
    width: 160,
  },
};

export const Wifi: Story = {
  args: {
    value: { type: "wifi", ssid: "Office Guest", password: "letmein", encryption: "WPA" },
    label: "Guest Wi-Fi",
    width: 160,
  },
};

export const Contact: Story = {
  args: {
    value: {
      type: "contact",
      name: "Jane Doe",
      phone: "+1 555 123 4567",
      email: "jane@example.com",
      organization: "Acme",
    },
    label: "Jane Doe",
    width: 160,
  },
};

export const TwoFactorAuth: Story = {
  args: {
    value: {
      type: "totp",
      secret: "JBSWY3DPEHPK3PXP",
      accountName: "jane@example.com",
      issuer: "Acme",
    },
    label: "2FA setup",
    width: 160,
  },
};

export const PhoneNumber: Story = {
  args: {
    value: { type: "phone", number: "+15551234567" },
    label: "Call support",
    width: 160,
  },
};

export const Sms: Story = {
  args: {
    value: { type: "sms", number: "+15551234567", message: "Confirm pickup" },
    label: "Text us",
    width: 160,
  },
};

export const Email: Story = {
  args: {
    value: { type: "email", to: "hello@example.com", subject: "Question" },
    label: "Email us",
    width: 160,
  },
};

export const GeoCoordinates: Story = {
  args: {
    value: { type: "geo", latitude: 52.52, longitude: 13.405 },
    label: "Meet here",
    width: 160,
  },
};

export const HighErrorCorrection: Story = {
  args: {
    value: { type: "url", url: "https://example.com" },
    label: "Damage-resistant",
    errorCorrectionLevel: "H",
    width: 160,
  },
};
