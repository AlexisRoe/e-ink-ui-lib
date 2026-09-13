import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "./grid.component";

describe("Grid", () => {
  it("renders its items", () => {
    render(
      <Grid>
        <Grid.Item>A</Grid.Item>
        <Grid.Item>B</Grid.Item>
      </Grid>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("defaults to 2 columns and the md gap", () => {
    const { container } = render(<Grid>content</Grid>);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid).toHaveClass("eink-grid--gap-md");
    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
  });

  it("applies the requested column count and gap", () => {
    const { container } = render(
      <Grid columns={4} gap="xl">
        content
      </Grid>,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe("repeat(4, 1fr)");
    expect(grid).toHaveClass("eink-grid--gap-xl");
  });

  it("uses auto-fit minmax when minColumnWidth is given", () => {
    const { container } = render(<Grid minColumnWidth={220}>content</Grid>);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe("repeat(auto-fit, minmax(220px, 1fr))");
  });

  it("spans the requested columns and rows on Grid.Item", () => {
    render(
      <Grid.Item colSpan={2} rowSpan={3}>
        cell
      </Grid.Item>,
    );
    const item = screen.getByText("cell");
    expect(item.style.gridColumn).toBe("span 2");
    expect(item.style.gridRow).toBe("span 3");
  });

  it("defaults Grid.Item to a single column and row", () => {
    render(<Grid.Item>cell</Grid.Item>);
    const item = screen.getByText("cell");
    expect(item.style.gridColumn).toBe("span 1");
    expect(item.style.gridRow).toBe("span 1");
  });

  it("renders Grid.Masonry with each child wrapped for reflow", () => {
    render(
      <Grid.Masonry>
        <span>first</span>
        <span>second</span>
      </Grid.Masonry>,
    );
    expect(screen.getByText("first").closest(".eink-grid-masonry__item")).toBeInTheDocument();
    expect(screen.getByText("second").closest(".eink-grid-masonry__item")).toBeInTheDocument();
  });

  it("applies minItemWidth as a CSS variable on Grid.Masonry", () => {
    const { container } = render(<Grid.Masonry minItemWidth={180}>content</Grid.Masonry>);
    const masonry = container.firstElementChild as HTMLElement;
    expect(masonry.style.getPropertyValue("--eink-grid-masonry-min-item-width")).toBe("180px");
  });
});
