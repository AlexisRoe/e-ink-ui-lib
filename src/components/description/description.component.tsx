import type { HTMLAttributes, JSX, ReactNode } from "react";

import { cx } from "../../utils/cx.utils";
import { Label } from "../label/label.component";
import { Text } from "../text/text.component";

import "./description.component.css";

/** Props accepted by {@link Description}. */
export interface DescriptionProps extends HTMLAttributes<HTMLDivElement> {
  /** Label shown above the value, e.g. `"Updated"`. */
  label: ReactNode;
  /** Value rendered below the label, e.g. `"Today, 14:02"`. */
  value: ReactNode;
}

/**
 * Renders a labeled key-value pair: a small uppercase label on top and its value below.
 *
 * @example
 * ```tsx
 * <Description label="Updated" value="Today, 14:02" />
 * ```
 */
function Description({ label, value, className, ...rest }: DescriptionProps) {
  return (
    <div className={cx("eink-description", [className ?? "", !!className])} {...rest}>
      <Label className="eink-description__label">{label}</Label>
      <Text className="eink-description__value">{value}</Text>
    </div>
  );
}

/** Props accepted by {@link Description.Group}. */
interface DescriptionGroup {
  /** One or more {@link Description} instances to lay out together. */
  children: ReactNode;
  /** Axis the child `Description` instances are arranged on. Defaults to `"vertical"`. */
  orientation?: "horizontal" | "vertical";
}

/**
 * Lays out multiple {@link Description} instances together, either stacked vertically
 * or arranged side by side horizontally.
 *
 * @example
 * ```tsx
 * <Description.Group orientation="horizontal">
 *   <Description label="Updated" value="Today, 14:02" />
 *   <Description label="Author" value="Jane Doe" />
 * </Description.Group>
 * ```
 */
function Group({ children, orientation = "vertical" }: DescriptionGroup): JSX.Element {
  const isHorizontal = orientation === "horizontal";
  const className = cx("eink-description__group", [
    "eink-description__group_horizonal",
    isHorizontal,
  ]);

  return <div className={className}>{children}</div>;
}

Description.Group = Group;

export { Description };
