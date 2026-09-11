import type { HTMLAttributes } from "react";
import { Children, isValidElement } from "react";
import type { ButtonProps } from "../Button/Button.component";
import { Button } from "../Button/Button.component";
import { cx } from "../theme/theme.provider";
import "./Card.component.css";

/** Props accepted by {@link Card}. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

/** Props accepted by {@link Card.Header}. */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props accepted by {@link Card.Title}. */
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props accepted by {@link Card.Subtitle}. */
export type CardSubtitleProps = HTMLAttributes<HTMLParagraphElement>;

/** Props accepted by {@link Card.Content}. */
export type CardContentProps = HTMLAttributes<HTMLDivElement>;

/** Props accepted by {@link Card.Action}. */
export type CardActionProps = ButtonProps;

/** Props accepted by {@link Card.Ribbon}. */
export type CardRibbonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Header section of {@link Card}, holding {@link Card.Title} and
 * {@link Card.Subtitle} on the left. A {@link Card.Action}, if provided, is
 * rendered on the right.
 */
function Header({ className, children, ...rest }: CardHeaderProps) {
  const items = Children.toArray(children);
  const isAction = (child: (typeof items)[number]) =>
    isValidElement(child) && child.type === Action;
  const actions = items.filter(isAction);
  const text = items.filter((child) => !isAction(child));

  return (
    <div className={cx("eink-card__header", [className ?? "", !!className])} {...rest}>
      <div className="eink-card__header-text">{text}</div>
      {actions.length > 0 ? <div className="eink-card__header-action">{actions}</div> : null}
    </div>
  );
}

/** Title text of a {@link Card.Header}. */
function Title({ className, children, ...rest }: CardTitleProps) {
  return (
    <h3 className={cx("eink-card__title", [className ?? "", !!className])} {...rest}>
      {children}
    </h3>
  );
}

/** Subtitle text of a {@link Card.Header}. */
function Subtitle({ className, children, ...rest }: CardSubtitleProps) {
  return (
    <p className={cx("eink-card__subtitle", [className ?? "", !!className])} {...rest}>
      {children}
    </p>
  );
}

/** Body section of {@link Card}. */
function Content({ className, children, ...rest }: CardContentProps) {
  return (
    <div className={cx("eink-card__content", [className ?? "", !!className])} {...rest}>
      {children}
    </div>
  );
}

/**
 * {@link Button} rendered on the right side of {@link Card.Header}. Accepts
 * every prop {@link Button} does (`onClick`, `iconLeft`/`iconRight`, `size`,
 * `fullWidth`, `loading`, `disabled`, etc.).
 */
function Action(props: CardActionProps) {
  return <Button {...props} />;
}

/**
 * Small black badge overlapping the top-right corner of {@link Card},
 * e.g. to flag a card as `"NEW"`.
 */
function Ribbon({ className, children, ...rest }: CardRibbonProps) {
  return (
    <div className={cx("eink-card__ribbon", [className ?? "", !!className])} {...rest}>
      {children}
    </div>
  );
}

/**
 * Bordered, padded container. Composes with {@link Card.Header},
 * {@link Card.Title}, {@link Card.Subtitle}, {@link Card.Content},
 * {@link Card.Action}, and {@link Card.Ribbon}, which are plain
 * semantic/typographic building blocks. When a {@link Card.Header}
 * immediately precedes a {@link Card.Content}, extra space is added between
 * them automatically; otherwise spacing is left to the consumer via
 * `className` or wrapping markup.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Ribbon>New</Card.Ribbon>
 *   <Card.Header>
 *     <Card.Title>Annual report</Card.Title>
 *     <Card.Subtitle>Finance · 2026</Card.Subtitle>
 *     <Card.Action onClick={() => download()}>Download</Card.Action>
 *   </Card.Header>
 *   <Card.Content>Full year results are now available.</Card.Content>
 * </Card>
 * ```
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cx("eink-card", [className ?? "", !!className])} {...rest}>
      {children}
    </div>
  );
}

Card.Header = Header;
Card.Title = Title;
Card.Subtitle = Subtitle;
Card.Content = Content;
Card.Action = Action;
Card.Ribbon = Ribbon;
