import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table } from "./table.component";

function renderTable(onSelectionChange?: (indexes: number[]) => void, className?: string) {
  return render(
    <Table className={className} onSelectionChange={onSelectionChange}>
      <Table.Head>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Anna König</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ben Müller</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
}

describe("Table", () => {
  it("renders header cells and row cells", () => {
    const { getByText } = renderTable();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Role")).toBeInTheDocument();
    expect(getByText("Anna König")).toBeInTheDocument();
    expect(getByText("Admin")).toBeInTheDocument();
  });

  it("starts with no row selected", () => {
    const { getAllByRole } = renderTable();
    for (const row of getAllByRole("row").slice(1)) {
      expect(row).toHaveAttribute("aria-selected", "false");
    }
  });

  it("inverts and marks a row selected on click", () => {
    const { getAllByRole } = renderTable();
    const row = getAllByRole("row")[1];
    fireEvent.click(row);
    expect(row).toHaveAttribute("aria-selected", "true");
    expect(row).toHaveClass("eink-invert-colors");
  });

  it("toggles selection off on a second click", () => {
    const { getAllByRole } = renderTable();
    const row = getAllByRole("row")[1];
    fireEvent.click(row);
    fireEvent.click(row);
    expect(row).toHaveAttribute("aria-selected", "false");
    expect(row).not.toHaveClass("eink-invert-colors");
  });

  it("calls onSelectionChange with the sorted array of selected indexes", () => {
    const onSelectionChange = vi.fn();
    const { getAllByRole } = renderTable(onSelectionChange);
    const rows = getAllByRole("row").slice(1);
    fireEvent.click(rows[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([1]);
    fireEvent.click(rows[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([0, 1]);
    fireEvent.click(rows[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([0]);
  });

  it("does not select a row rendered with selectable={false}", () => {
    const onSelectionChange = vi.fn();
    const { getAllByRole } = render(
      <Table onSelectionChange={onSelectionChange}>
        <Table.Body>
          <Table.Row selectable={false}>
            <Table.Cell>Static row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const row = getAllByRole("row")[0];
    fireEvent.click(row);
    expect(row).not.toHaveAttribute("aria-selected");
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("merges a custom className", () => {
    const { container } = renderTable(undefined, "custom");
    expect(container.querySelector(".eink-table")).toHaveClass("custom");
  });

  it("selects a row with the keyboard", () => {
    const onSelectionChange = vi.fn();
    const { getAllByRole } = renderTable(onSelectionChange);
    const row = getAllByRole("row")[1];
    fireEvent.keyDown(row, { key: "Enter" });
    expect(row).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(row, { key: " " });
    expect(row).toHaveAttribute("aria-selected", "false");
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });

  it("does not select or focus a disabled row", () => {
    const onSelectionChange = vi.fn();
    const { getAllByRole } = render(
      <Table onSelectionChange={onSelectionChange}>
        <Table.Body>
          <Table.Row disabled>
            <Table.Cell>Static row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const row = getAllByRole("row")[0];
    expect(row).toHaveClass("eink-table-row--disabled");
    expect(row).not.toHaveAttribute("tabindex");
    fireEvent.click(row);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("renders diagonal stripes instead of a grey background on a disabled row when mono", () => {
    const { getAllByRole, container } = render(
      <Table mono>
        <Table.Body>
          <Table.Row disabled>
            <Table.Cell>Static row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const row = getAllByRole("row")[0];
    expect(row).toHaveClass("eink-table-row--disabled-mono");
    expect(row).not.toHaveClass("eink-table-row--disabled");
    expect(container.querySelector(".eink-table-row__stripes")).not.toBeNull();
  });

  it("preselects rows on first render", () => {
    const { getAllByRole } = render(
      <Table preselectedIndexes={[1]}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>A</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>B</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const rows = getAllByRole("row");
    expect(rows[0]).toHaveAttribute("aria-selected", "false");
    expect(rows[1]).toHaveAttribute("aria-selected", "true");
  });

  it("keeps row indexes unique across multiple Table.Body sections", () => {
    const onSelectionChange = vi.fn();
    const { getAllByRole } = render(
      <Table onSelectionChange={onSelectionChange}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Section A row</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Section B row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const rows = getAllByRole("row");
    fireEvent.click(rows[0]);
    expect(rows[0]).toHaveAttribute("aria-selected", "true");
    expect(rows[1]).toHaveAttribute("aria-selected", "false");
    expect(onSelectionChange).toHaveBeenLastCalledWith([0]);
  });

  it("applies the sticky header modifier class", () => {
    const { container } = renderTable();
    expect(container.querySelector(".eink-table")).not.toHaveClass("eink-table--sticky-header");
  });

  it("renders an empty state icon and matches the header's column count, with a dashed lower border", () => {
    const { container, getByText } = render(
      <Table>
        <Table.Head>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Head>
        <Table.Body />
      </Table>,
    );
    const emptyCell = container.querySelector(".eink-table-cell--empty");
    expect(emptyCell?.querySelector(".eink-table-cell__empty-icon")).not.toBeNull();
    expect(emptyCell).toHaveAttribute("colspan", "2");
    expect(container.querySelector(".eink-table")).toHaveClass("eink-table--empty");
    expect(getByText("Name")).toBeInTheDocument();
  });

  it("renders a custom emptyLabel", () => {
    const { getByText } = render(
      <Table>
        <Table.Body emptyLabel="Nothing here" />
      </Table>,
    );
    expect(getByText("Nothing here")).toBeInTheDocument();
  });
});
