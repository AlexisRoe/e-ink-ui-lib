import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";

import "./container.component.css";

/** Props accepted by {@link Container}. */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders a border around the container. Defaults to `true`. */
  withBorder?: boolean;
  /** Stretches the container to 100% width of its parent. Defaults to `false`. */
  fullWidth?: boolean;
  /** Stretches the container to 100% height of its parent. Defaults to `false`. */
  fullHeight?: boolean;
  /** Centers children both horizontally and vertically. Defaults to `false`. */
  centered?: boolean;
}

/**
 * Generic enclosing container for other components. Has a fixed `2px`
 * padding on all sides and an optional border (`withBorder`, defaults to
 * `true`). Accepts `fullWidth`/`fullHeight` to stretch to fill its parent
 * along either axis, and `centered` to center its children.
 *
 * @example
 * ```tsx
 * <Container centered fullWidth>
 *   <Text>Nothing here yet</Text>
 * </Container>
 * ```
 */
export function Container({
  className,
  withBorder = true,
  fullWidth = false,
  fullHeight = false,
  centered = false,
  ...rest
}: ContainerProps) {
  return (
    <div
      data-eink-component="container"
      className={cx(
        "eink-container",
        ["eink-container--border", withBorder],
        ["eink-container--full-width", fullWidth],
        ["eink-container--full-height", fullHeight],
        ["eink-container--centered", centered],
        [className ?? "", !!className],
      )}
      {...rest}
    />
  );
}
