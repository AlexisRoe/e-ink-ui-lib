import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./modal.component";
import { ModalProvider } from "./modal.provider";

describe("Modal", () => {
  it("renders nothing when used without a ModalProvider", () => {
    render(
      <Modal open title="Delete item">
        Content
      </Modal>,
    );
    expect(screen.queryByText("Delete item")).not.toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(
      <ModalProvider>
        <Modal open={false} title="Delete item">
          Content
        </Modal>
      </ModalProvider>,
    );
    expect(screen.queryByText("Delete item")).not.toBeInTheDocument();
  });

  it("renders the title and body content when open", () => {
    render(
      <ModalProvider>
        <Modal open title="Delete item">
          Are you sure?
        </Modal>
      </ModalProvider>,
    );
    expect(screen.getByText("Delete item")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render Modal.Close, Modal.CloseButton, or Modal.ActionButton unless supplied as children", () => {
    render(
      <ModalProvider>
        <Modal open title="Delete item">
          Are you sure?
        </Modal>
      </ModalProvider>,
    );
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onClosed when Modal.Close is clicked", () => {
    const onClosed = vi.fn();
    render(
      <ModalProvider>
        <Modal open title="Delete item" onClosed={onClosed}>
          <Modal.Close />
          Are you sure?
        </Modal>
      </ModalProvider>,
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it("calls onClosed when Modal.CloseButton is clicked", () => {
    const onClosed = vi.fn();
    render(
      <ModalProvider>
        <Modal open title="Delete item" onClosed={onClosed}>
          <Modal.CloseButton>Cancel</Modal.CloseButton>
        </Modal>
      </ModalProvider>,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it("calls onAccept when Modal.ActionButton is clicked", () => {
    const onAccept = vi.fn();
    render(
      <ModalProvider>
        <Modal open title="Delete item" onAccept={onAccept}>
          <Modal.ActionButton>Delete</Modal.ActionButton>
        </Modal>
      </ModalProvider>,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onClosed when the overlay is clicked, but not when the modal itself is clicked", () => {
    const onClosed = vi.fn();
    render(
      <ModalProvider>
        <Modal open title="Delete item" onClosed={onClosed}>
          Are you sure?
        </Modal>
      </ModalProvider>,
    );
    fireEvent.click(screen.getByText("Are you sure?"));
    expect(onClosed).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onClosed).toHaveBeenCalledTimes(1);
  });
});
