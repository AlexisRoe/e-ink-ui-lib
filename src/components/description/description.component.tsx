import type { HTMLAttributes, ReactNode } from "react";

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
export function Description({ label, value, className, ...rest }: DescriptionProps) {
  return (
    <div className={cx("eink-description", [className ?? "", !!className])} {...rest}>
      <Label className="eink-description__label">{label}</Label>
      <Text className="eink-description__value">{value}</Text>
    </div>
  );
}
