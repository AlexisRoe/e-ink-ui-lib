import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Chip } from "./chip.component";

describe("Chip", () => {
  it("renders unselected by default", () => {
    render(<Chip>Favorite</Chip>);
    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("toggles selected state when uncontrolled", () => {
    render(<Chip defaultSelected>Favorite</Chip>);
    const chip = screen.getByRole("button", { name: "Favorite" });
    expect(chip).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect and stays controlled when selected is provided", () => {
    const onSelect = vi.fn();
    render(
      <Chip selected={false} onSelect={onSelect}>
        Favorite
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Favorite" });
    fireEvent.click(chip);

    expect(onSelect).toHaveBeenCalledWith(true);
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("does not toggle when disabled", () => {
    const onSelect = vi.fn();
    render(
      <Chip disabled onSelect={onSelect}>
        Favorite
      </Chip>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("Chip.Group", () => {
  it("single-selects a chip and calls onChange with its value", () => {
    const onChange = vi.fn();
    render(
      <Chip.Group defaultValue="all" onChange={onChange}>
        <Chip value="all">All</Chip>
        <Chip value="drafts">Drafts</Chip>
        <Chip value="published">Published</Chip>
      </Chip.Group>,
    );

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Drafts" }));

    expect(onChange).toHaveBeenCalledWith("drafts");
    expect(screen.getByRole("button", { name: "Drafts" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
  });

  it("multi-selects chips and calls onChange with the full array", () => {
    const onChange = vi.fn();
    render(
      <Chip.Group multiple defaultValue={["drafts"]} onChange={onChange}>
        <Chip value="drafts">Drafts</Chip>
        <Chip value="published">Published</Chip>
      </Chip.Group>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Published" }));
    expect(onChange).toHaveBeenCalledWith(["drafts", "published"]);

    fireEvent.click(screen.getByRole("button", { name: "Drafts" }));
    expect(onChange).toHaveBeenLastCalledWith(["published"]);
  });

  it("disables every chip when the group is disabled", () => {
    render(
      <Chip.Group disabled defaultValue="all">
        <Chip value="all">All</Chip>
        <Chip value="drafts">Drafts</Chip>
      </Chip.Group>,
    );
    expect(screen.getByRole("button", { name: "All" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Drafts" })).toBeDisabled();
  });

  it("binds to a Form field by name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ status: "all" }} onSubmit={onSubmit}>
        <Chip.Group name="status">
          <Chip value="all">All</Chip>
          <Chip value="drafts">Drafts</Chip>
        </Chip.Group>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Drafts" }));
    expect(screen.getByRole("button", { name: "Drafts" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ status: "drafts" }, expect.anything());
  });
});
