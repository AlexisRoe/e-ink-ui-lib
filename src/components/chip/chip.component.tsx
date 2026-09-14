import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";
import "./chip.component.css";

interface ChipGroupContextValue {
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
}

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

function normalizeValues(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** Props accepted by {@link Chip}. */
export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onSelect"> {
  /** Text shown inside the chip. */
  children: ReactNode;
  /** Name of an icon rendered on the left side of the chip. */
  icon?: IconName;
  /**
   * Identifies this chip inside a {@link Chip.Group}. Required when nested in
   * a group; ignored for standalone use.
   */
  value?: string;
  /** Controlled selected state for standalone use, outside a {@link Chip.Group}. */
  selected?: boolean;
  /** Initial selected state for uncontrolled standalone use. Defaults to `false`. */
  defaultSelected?: boolean;
  /**
   * Called with the next selected state when clicked. Ignored inside a
   * {@link Chip.Group}, which reports selection through its own `onChange`.
   */
  onSelect?: (selected: boolean) => void;
}

/**
 * Toggleable, pill-shaped filter button for e-ink displays. Renders as a
 * native `<button>` with `aria-pressed` reflecting its selected state, so it
 * is keyboard- and screen-reader-accessible without extra markup.
 *
 * Works two ways:
 * - **Standalone**: use `selected`/`onSelect` (controlled) or
 *   `defaultSelected` (uncontrolled) to toggle a single chip on its own.
 * - **Grouped**: nest it inside {@link Chip.Group} and give it a unique
 *   `value`; the group manages which chip(s) are selected.
 *
 * @example
 * ```tsx
 * <Chip icon="star" defaultSelected>Favorite</Chip>
 *
 * <Chip.Group defaultValue="all" onChange={(value) => setFilter(value)}>
 *   <Chip value="all">All</Chip>
 *   <Chip value="drafts">Drafts</Chip>
 *   <Chip value="published">Published</Chip>
 * </Chip.Group>
 * ```
 */
export function Chip({
  className,
  children,
  icon,
  value,
  selected,
  defaultSelected = false,
  onSelect,
  disabled,
  ...rest
}: ChipProps) {
  const group = useContext(ChipGroupContext);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const isDisabled = disabled || (group?.disabled ?? false);
  const isSelected = group ? group.isSelected(value ?? "") : (selected ?? internalSelected);

  const handleClick = () => {
    if (isDisabled) return;
    if (group) {
      group.toggle(value ?? "");
      return;
    }
    const next = !isSelected;
    if (selected === undefined) setInternalSelected(next);
    onSelect?.(next);
  };

  return (
    <button
      type="button"
      className={cx(
        "eink-chip",
        [className ?? "", !!className],
        ["eink-chip--selected", isSelected],
      )}
      aria-pressed={isSelected}
      disabled={isDisabled}
      onClick={handleClick}
      {...rest}
    >
      {icon ? <Icon name={icon} size={16} className="eink-chip__icon" aria-hidden="true" /> : null}
      <span className="eink-chip__label">{children}</span>
    </button>
  );
}

/** Props accepted by {@link Chip.Group}. */
export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** {@link Chip} elements managed by this group. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, the group
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Allows more than one chip to be selected at once. Defaults to `false`. */
  multiple?: boolean;
  /**
   * Currently selected value(s) for standalone use, outside a `<Form>`. A
   * single string when `multiple` is `false`, an array of strings otherwise.
   */
  value?: string | string[];
  /** Initial value(s) for uncontrolled standalone use. */
  defaultValue?: string | string[];
  /** Called with the next value(s) whenever a chip is clicked. Ignored when `name` is set. */
  onChange?: (value: string | string[]) => void;
  /** Disables every chip in the group. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * Wraps a set of {@link Chip}s and manages which one(s) are selected, either
 * as a single-select filter (default) or, with `multiple`, a multi-select
 * group. Chips are laid out in a wrapping row with a gap between them.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the selected value (`string`, or `string[]` when
 * `multiple`). Without `name`, use it as a controlled component with
 * `value`/`onChange`, or uncontrolled with `defaultValue`.
 *
 * @example
 * ```tsx
 * <Chip.Group name="status" multiple>
 *   <Chip value="drafts">Drafts</Chip>
 *   <Chip value="published">Published</Chip>
 *   <Chip value="archived">Archived</Chip>
 * </Chip.Group>
 * ```
 */
function ChipGroup({
  className,
  children,
  name,
  multiple = false,
  value,
  defaultValue,
  onChange,
  disabled = false,
  ...rest
}: ChipGroupProps) {
  const form = useContext(FormContext);
  const [internalValues, setInternalValues] = useState<string[]>(() =>
    normalizeValues(defaultValue),
  );

  const currentValues =
    name && form
      ? normalizeValues(form.getValue(name) as string | string[] | undefined)
      : value !== undefined
        ? normalizeValues(value)
        : internalValues;

  const commit = (nextValues: string[]) => {
    const next: string | string[] = multiple ? nextValues : (nextValues[0] ?? "");
    if (name && form) {
      form.setValue(name, next);
    } else {
      if (value === undefined) setInternalValues(nextValues);
      onChange?.(next);
    }
  };

  const toggle = (itemValue: string) => {
    if (multiple) {
      const next = currentValues.includes(itemValue)
        ? currentValues.filter((entry) => entry !== itemValue)
        : [...currentValues, itemValue];
      commit(next);
    } else {
      commit([itemValue]);
    }
  };

  const isSelected = (itemValue: string) => currentValues.includes(itemValue);

  return (
    <ChipGroupContext.Provider value={{ isSelected, toggle, disabled }}>
      <div className={cx("eink-chip-group", [className ?? "", !!className])} {...rest}>
        {children}
      </div>
    </ChipGroupContext.Provider>
  );
}

Chip.Group = ChipGroup;
