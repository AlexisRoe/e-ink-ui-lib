import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { BreadCrumbs } from "../components/breadcrumbs/breadcrumbs.component";
import { Divider } from "../components/divider/divider.component";
import { Page } from "../components/page/page.component";
import { Pagination } from "../components/pagination/pagination.component";
import { ProgressBar } from "../components/progress-bar/progress-bar.component";
import { Stepper } from "../components/stepper/stepper.component";
import { Text } from "../components/text/text.component";
import { Title } from "../components/title/title.component";

/**
 * Example composition: a multi-page document viewer combining `Page` for
 * the overall layout, `BreadCrumbs` and a `Stepper` for the document
 * location, a `ProgressBar` showing reading progress, and `Pagination` to
 * move between pages.
 *
 * Fills the viewport like {@link Page} does — open this story's canvas in
 * its own browser tab to see it at full size.
 */
const meta = {
  title: "Applications/Multi-page Document",
  component: Page,
  tags: ["autodocs"],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

const PAGE_COUNT = 4;
const CHAPTERS = ["Health insurance", "Retirement", "Paid time off", "Other benefits"];

function DocumentDemo() {
  const [page, setPage] = useState(2);
  const percent = Math.round((page / PAGE_COUNT) * 100);

  return (
    <Page navSide="left" collapsedMode="hidden" defaultNavOpen={false}>
      <Page.Header>
        <BreadCrumbs>
          <BreadCrumbs.Item target="/">Documents</BreadCrumbs.Item>
          <BreadCrumbs.Item target="/handbook">Employee Handbook</BreadCrumbs.Item>
          <BreadCrumbs.Item target="/handbook/benefits">Benefits</BreadCrumbs.Item>
        </BreadCrumbs>
        <Stepper currentIndex={page - 1}>
          {CHAPTERS.map((chapter) => (
            <Stepper.Item key={chapter} title={chapter} />
          ))}
        </Stepper>
      </Page.Header>
      <Page.Body>
        <Title size="2">Employee Handbook — Benefits</Title>
        <Text>
          This section covers health insurance, retirement contributions, paid time off, and other
          benefits available to full-time employees. Continue reading on the following pages, or
          jump directly to a page using the controls below.
        </Text>
      </Page.Body>
      <Page.Footer>
        <Divider />
        <ProgressBar value={percent} label={`Page ${page} of ${PAGE_COUNT}`} />
        <Pagination pageCount={PAGE_COUNT} page={page} onPageChange={setPage} />
      </Page.Footer>
    </Page>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => <DocumentDemo />,
};
