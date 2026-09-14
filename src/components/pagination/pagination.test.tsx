import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination.component";

describe("Pagination", () => {
  it("marks the current page", () => {
    render(<Pagination pageCount={5} page={3} />);
    expect(screen.getByLabelText("Page 3")).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("Page 2")).not.toHaveAttribute("aria-current");
  });

  it("always renders the first and last page", () => {
    render(<Pagination pageCount={50} page={25} />);
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 50")).toBeInTheDocument();
  });

  it("calls onPageChange when a page number is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={5} page={1} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByLabelText("Page 3"));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the next/previous page", () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={5} page={2} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with the first/last page", () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={10} page={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByLabelText("First page"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText("Last page"));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it("disables first/previous on the first page and last/next on the last page", () => {
    render(<Pagination pageCount={5} page={1} />);
    expect(screen.getByLabelText("First page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
    expect(screen.getByLabelText("Last page")).not.toBeDisabled();
  });

  it("does not call onPageChange when clicking the current page", () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={5} page={2} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByLabelText("Page 2"));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
