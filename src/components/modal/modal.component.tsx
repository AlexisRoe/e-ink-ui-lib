import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { Children, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { useModalContainer } from "./modal.provider";

import "./modal.component.css";

/** Sizes accepted by {@link Modal}. Defaults to `"md"`. */
export type ModalSize = "sm" | "md" | "xl";

/** Overlay backgrounds accepted by {@link Modal}. Defaults to `"semi-transparent"`. */
export type ModalOverlay = "white" | "black" | "transparent" | "semi-transparent";

/** Props accepted by {@link Modal}. */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the modal is open. When `false`, nothing is rendered internally, so no state is kept stale between openings. */
  open: boolean;
  /** Title shown at the top of the modal, next to {@link Modal.Close} if present. */
  title: ReactNode;
  /** Size of the modal. Defaults to `"md"`. */
  size?: ModalSize;
  /** Background of the overlay behind the modal. Defaults to `"semi-transparent"` (semi-transparent white). */
  overlay?: ModalOverlay;
  /** Called when the modal is dismissed: overlay click, {@link Modal.Close}, or {@link Modal.CloseButton}. */
  onClosed?: () => void;
  /** Called when {@link Modal.ActionButton} is clicked. */
  onAccept?: () => void;
}

/** Props accepted by {@link Modal.Close}. */
export interface ModalCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible label. Defaults to `"Close"`. */
  "aria-label"?: string;
}

/** Props accepted by {@link Modal.CloseButton} and {@link Modal.ActionButton}. */
export interface ModalFooterButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Label of the button. */
  children: ReactNode;
}

/**
 * Naked "X" icon button rendered on the same line as the title, on the
 * right. Optional — only rendered when present among {@link Modal}'s
 * children, regardless of where in the children it appears.
 */
function ModalClose({ className, "aria-label": ariaLabel = "Close", ...rest }: ModalCloseProps) {
  return (
    <Button.IconNaked
      icon="close"
      aria-label={ariaLabel}
      className={cx("eink-modal__close", [className ?? "", !!className])}
      {...rest}
    />
  );
}

/**
 * Outlined button rendered in the modal footer, on the right. Its label is
 * its `children`. Clicking it calls {@link ModalProps.onClosed}.
 */
function ModalCloseButton({ className, children, ...rest }: ModalFooterButtonProps) {
  return (
    <Button.Outlined
      className={cx("eink-modal__close-button", [className ?? "", !!className])}
      {...rest}
    >
      {children}
    </Button.Outlined>
  );
}

/**
 * Filled (main) button rendered in the modal footer, on the right, after
 * {@link Modal.CloseButton}. Its label is its `children`. Clicking it calls
 * {@link ModalProps.onAccept}.
 */
function ModalActionButton({ className, children, ...rest }: ModalFooterButtonProps) {
  return (
    <Button className={cx("eink-modal__action-button", [className ?? "", !!className])} {...rest}>
      {children}
    </Button>
  );
}

function findChild(
  children: ReactNode[],
  type: unknown,
): ReactElement<{ onClick?: (event: MouseEvent<HTMLButtonElement>) => void }> | undefined {
  return children.find(
    (child): child is ReactElement<{ onClick?: (event: MouseEvent<HTMLButtonElement>) => void }> =>
      isValidElement(child) && child.type === type,
  );
}

function withClick(
  element: ReactElement<{ onClick?: (event: MouseEvent<HTMLButtonElement>) => void }> | undefined,
  handler: () => void,
) {
  if (!element) {
    return null;
  }
  const existingOnClick = element.props.onClick;
  return cloneElement(element, {
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      existingOnClick?.(event);
      handler();
    },
  });
}

/**
 * Centered dialog rendered into the container created by
 * {@link ModalProvider}, so it renders on top of everything else on the
 * page. Renders nothing when used without an ancestor `ModalProvider`, and
 * renders nothing internally while `open` is `false`, so no state is kept
 * stale between openings.
 *
 * Laid out with CSS grid, so `title`, `body` content, and the optional
 * {@link Modal.Close}, {@link Modal.CloseButton}, and
 * {@link Modal.ActionButton} always render in their fixed slots no matter
 * where they appear among `children`.
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   title="Delete item"
 *   onClosed={() => setOpen(false)}
 *   onAccept={() => deleteItem()}
 * >
 *   <Modal.Close />
 *   <p>This can't be undone.</p>
 *   <Modal.CloseButton>Cancel</Modal.CloseButton>
 *   <Modal.ActionButton>Delete</Modal.ActionButton>
 * </Modal>
 * ```
 */
export function Modal({
  className,
  title,
  size = "md",
  overlay = "semi-transparent",
  open,
  onClosed,
  onAccept,
  children,
  ...rest
}: ModalProps) {
  const container = useModalContainer();

  if (!open || !container) {
    return null;
  }

  const childArray = Children.toArray(children);
  const close = withClick(findChild(childArray, ModalClose), () => onClosed?.());
  const closeButton = withClick(findChild(childArray, ModalCloseButton), () => onClosed?.());
  const actionButton = withClick(findChild(childArray, ModalActionButton), () => onAccept?.());
  const body = childArray.filter(
    (child) =>
      !(
        isValidElement(child) &&
        (child.type === ModalClose ||
          child.type === ModalCloseButton ||
          child.type === ModalActionButton)
      ),
  );

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClosed?.();
    }
  };

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: dismiss-on-click-outside area behind the dialog, not itself a keyboard-interactive control.
    // biome-ignore lint/a11y/useKeyWithClickEvents: same as above; the dialog inside provides the interactive content.
    <div
      className={`eink-modal-overlay eink-modal-overlay--${overlay}`}
      onClick={handleOverlayClick}
    >
      <div
        className={cx(`eink-modal eink-modal--${size}`, [className ?? "", !!className])}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        <div className="eink-modal__title">{title}</div>
        {close}
        <div className="eink-modal__body">{body}</div>
        {(closeButton || actionButton) && (
          <div className="eink-modal__footer">
            {closeButton}
            {actionButton}
          </div>
        )}
      </div>
    </div>,
    container,
  );
}

Modal.Close = ModalClose;
Modal.CloseButton = ModalCloseButton;
Modal.ActionButton = ModalActionButton;
