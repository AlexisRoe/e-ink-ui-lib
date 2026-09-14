import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";
import { Label } from "../label/label.component";
import "./select.component.css";

function normalizeValues(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

interface SelectContextValue {
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  multiple: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

/** Props accepted by {@link Select.Option}. */
export interface SelectOptionProps extends Omit<HTMLAttributes<HTMLLIElement>, "onSelect"> {
  /** Value reported to the enclosing {@link Select} when this option is chosen. */
  value: string;
  /** Optional icon shown before the label. */
  icon?: IconName;
  /** Label content. */
  children: ReactNode;
}

/**
 * Single choice inside a {@link Select} or {@link Select.Group}. Renders as a
 * `role="option"` row, its `aria-selected` reflecting whether its `value` is
 * currently chosen.
 *
 * @example
 * ```tsx
 * <Select.Option value="apple" icon="star">Apple</Select.Option>
 * ```
 */
function SelectOption({ className, value, icon, children, ...rest }: SelectOptionProps) {
  const context = useContext(SelectContext);
  const isSelected = context?.isSelected(value) ?? false;

  const handleClick = () => context?.toggle(value);
  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      context?.toggle(value);
    }
  };

  return (
    <li
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: role="option" on li matches the surrounding listbox semantics, same pattern as DropdownMenu's ul/li.
      role="option"
      tabIndex={0}
      aria-selected={isSelected}
      className={cx(
        "eink-select-option",
        [className ?? "", !!className],
        ["eink-select-option--selected", isSelected],
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {icon && (
        <Icon name={icon} size={16} className="eink-select-option__icon" aria-hidden="true" />
      )}
      <span className="eink-select-option__label">{children}</span>
      {context?.multiple && (
        <Icon name="check" size={16} className="eink-select-option__check" aria-hidden="true" />
      )}
    </li>
  );
}

/** Props accepted by {@link Select.Group}. */
export interface SelectGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Optional heading shown in a filled black bar above the group's options. */
  label?: ReactNode;
  /** {@link Select.Option} elements making up the group. */
  children: ReactNode;
}

/**
 * Groups {@link Select.Option} rows inside a {@link Select}, separated from
 * the group above it by a divider line. An optional `label` renders as a
 * filled black heading bar above the group's options.
 *
 * @example
 * ```tsx
 * <Select.Group label="Fruit">
 *   <Select.Option value="apple">Apple</Select.Option>
 *   <Select.Option value="banana">Banana</Select.Option>
 * </Select.Group>
 * ```
 */
function SelectGroup({ className, label, children, ...rest }: SelectGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset can't be a child of a listbox; role="group" on ul matches the surrounding listbox semantics.
    <ul
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
      className={cx("eink-select-group", [className ?? "", !!className])}
      {...rest}
    >
      {label && (
        <li className="eink-select-group__label" aria-hidden="true">
          {label}
        </li>
      )}
      {children}
    </ul>
  );
}

function findOption(
  children: ReactNode,
  value: string,
): { icon?: IconName; children: ReactNode } | undefined {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if (child.type === SelectOption) {
      const props = child.props as SelectOptionProps;
      if (props.value === value) return { icon: props.icon, children: props.children };
    } else if (child.type === SelectGroup) {
      const props = child.props as SelectGroupProps;
      const found = findOption(props.children, value);
      if (found) return found;
    }
  }
  return undefined;
}

/** Props accepted by {@link Select}. */
export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the trigger button. */
  label: ReactNode;
  /** Text shown inside the trigger button when nothing is selected. */
  placeholder: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Select`
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Allows more than one option to be selected at once. Defaults to `false`. */
  multiple?: boolean;
  /**
   * Currently selected value(s) for standalone use, outside a `<Form>`. A
   * single string when `multiple` is `false`, an array of strings otherwise.
   */
  value?: string | string[];
  /** Initial value(s) for uncontrolled standalone use. */
  defaultValue?: string | string[];
  /** Called with the next value(s) whenever an option is chosen. Ignored when `name` is set. */
  onChange?: (value: string | string[]) => void;
  /** Disables the trigger button. */
  disabled?: boolean;
  /**
   * When true, marks the field required: renders a `*` after the label, and,
   * when bound to a `<Form>` via `name`, sets a field error while nothing is
   * selected, keeping `Form.SubmitButton` disabled until a choice is made.
   */
  required?: boolean;
  /** {@link Select.Option} / {@link Select.Group} elements making up the list. */
  children: ReactNode;
}

/**
 * Dropdown selector for e-ink displays. Renders an accessible combobox: a
 * trigger `<button>` (`aria-haspopup="listbox"`, `aria-expanded`) that opens
 * a `role="listbox"` of {@link Select.Option} rows, optionally grouped with
 * {@link Select.Group} and each carrying an optional icon on the left.
 *
 * Supports single-select (default) or, with `multiple`, multi-select (each
 * chosen option shows a checkmark and the listbox stays open between picks).
 * The trigger shows `placeholder` until a choice is made, then the selected
 * option's label (or, in `multiple` mode, a count of selected options).
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the selected value (`string`, or `string[]` when
 * `multiple`). Without `name`, use it as a controlled component with
 * `value`/`onChange`, or uncontrolled with `defaultValue`.
 *
 * Pass `required` to render a `*` after the label; when bound to a `<Form>`
 * via `name`, this also blocks submission until at least one option is
 * selected.
 *
 * @example
 * ```tsx
 * <Select name="fruit" label="Fruit" placeholder="Pick…" required>
 *   <Select.Option value="apple">Apple</Select.Option>
 *   <Select.Option value="banana">Banana</Select.Option>
 * </Select>
 * ```
 */
export function Select({
  className,
  label,
  placeholder,
  name,
  multiple = false,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  children,
  ...rest
}: SelectProps) {
  const form = useContext(FormContext);
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState<string[]>(() =>
    normalizeValues(defaultValue),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const listId = useId();

  const currentValues =
    name && form
      ? normalizeValues(form.getValue(name) as string | string[] | undefined)
      : value !== undefined
        ? normalizeValues(value)
        : internalValues;

  const validate = useCallback(
    (next: string[]) => (required && next.length === 0 ? "Select an option" : undefined),
    [required],
  );

  const commit = useCallback(
    (next: string[]) => {
      const nextValue: string | string[] = multiple ? next : (next[0] ?? "");
      if (name && form) {
        form.setValue(name, nextValue);
        const nextError = validate(next);
        if (form.getError(name) !== nextError) {
          form.setError(name, nextError);
        }
      } else {
        onChange?.(nextValue);
      }
    },
    [multiple, name, form, onChange, validate],
  );

  // Validate the initial/preselected value too, so an empty required select
  // blocks submission from the start rather than only after the first pick.
  useEffect(() => {
    if (name && form) {
      const nextError = validate(currentValues);
      if (form.getError(name) !== nextError) {
        form.setError(name, nextError);
      }
    }
  }, [name, form, validate, currentValues]);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const toggle = (optionValue: string) => {
    if (multiple) {
      const next = currentValues.includes(optionValue)
        ? currentValues.filter((entry) => entry !== optionValue)
        : [...currentValues, optionValue];
      if (value === undefined && !(name && form)) setInternalValues(next);
      commit(next);
    } else {
      if (value === undefined && !(name && form)) setInternalValues([optionValue]);
      commit([optionValue]);
      setOpen(false);
    }
  };

  const isSelected = (optionValue: string) => currentValues.includes(optionValue);

  const triggerLabel =
    currentValues.length === 0
      ? placeholder
      : multiple
        ? `${currentValues.length} selected`
        : (findOption(children, currentValues[0] ?? "")?.children ?? placeholder);

  return (
    <div ref={containerRef} className={cx("eink-select", [className ?? "", !!className])} {...rest}>
      <Label.Form htmlFor={triggerId} className="eink-select__label">
        {label}
        {required ? <span className="eink-select__required">*</span> : null}
      </Label.Form>
      <button
        id={triggerId}
        type="button"
        className="eink-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="eink-select__trigger-label">{triggerLabel}</span>
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          className="eink-select__chevron"
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          id={listId}
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching DropdownMenu's menu/list.
          role="listbox"
          aria-multiselectable={multiple}
          className="eink-select__list"
        >
          <SelectContext.Provider value={{ isSelected, toggle, multiple }}>
            {children}
          </SelectContext.Provider>
        </ul>
      )}
    </div>
  );
}

Select.Option = SelectOption;
Select.Group = SelectGroup;
