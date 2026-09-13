import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { Children, cloneElement, createContext, isValidElement, useContext, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./todo.component.css";

/** Identifier reported for a {@link Todo.Item}: its `id` prop, or its index among siblings when `id` is omitted. */
export type TodoItemIdentifier = string | number;

interface TodoContextValue {
  onItemChange: (identifier: TodoItemIdentifier, checked: boolean) => void;
}

const TodoContext = createContext<TodoContextValue | null>(null);

/** Props accepted by {@link Todo.Item}. */
export interface TodoItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "id" | "onClick"> {
  /** Unique identifier for this item, reported to {@link TodoProps.onChange}. Defaults to the item's index among siblings when omitted. */
  id?: string;
  /** Whether the item is checked when it first renders. Defaults to `false`. */
  initialState?: boolean;
  /** Text describing the task. */
  children: ReactNode;
}

interface TodoItemInternalProps extends TodoItemProps {
  index?: number;
}

/**
 * Single todo entry rendered on its own line with a round checkbox in front.
 * Clicking it toggles between the empty and checked state, reporting the
 * new state to the parent {@link Todo} via context.
 *
 * @example
 * ```tsx
 * <Todo.Item id="water-plants">Water the plants</Todo.Item>
 * ```
 */
function TodoItem({
  className,
  id,
  index = 0,
  initialState = false,
  children,
  ...rest
}: TodoItemInternalProps) {
  const [checked, setChecked] = useState(initialState);
  const context = useContext(TodoContext);

  return (
    <button
      type="button"
      className={cx("eink-todo-item", [className ?? "", !!className])}
      aria-pressed={checked}
      onClick={() => {
        const next = !checked;
        setChecked(next);
        context?.onItemChange(id ?? index, next);
      }}
      {...rest}
    >
      <span className={cx("eink-todo-item__circle", ["eink-todo-item__circle--checked", checked])}>
        {checked && <Icon className="eink-todo-item__icon" name="check" />}
      </span>
      <span className="eink-todo-item__label">{children}</span>
    </button>
  );
}

/** Props accepted by {@link Todo}. */
export interface TodoProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  /** Optional title rendered above the list of items. */
  title?: ReactNode;
  /** Called whenever an item is toggled, with its identifier ({@link TodoItemProps.id} or index) and new checked state. */
  onChange?: (identifier: TodoItemIdentifier, checked: boolean) => void;
}

/**
 * A list of checkable tasks. Composes {@link Todo.Item} for each entry; each
 * item renders on its own line with a round checkbox that fills in with a
 * check icon once marked done. Items report their state changes up to
 * {@link TodoProps.onChange} via context.
 *
 * @example
 * ```tsx
 * <Todo title="Today" onChange={(id, checked) => console.log(id, checked)}>
 *   <Todo.Item id="water-plants">Water the plants</Todo.Item>
 *   <Todo.Item id="feed-cat" initialState>Feed the cat</Todo.Item>
 * </Todo>
 * ```
 */
export function Todo({ className, title, children, onChange, ...rest }: TodoProps) {
  let index = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement<TodoItemProps>(child) || child.type !== TodoItem) {
      return child;
    }
    return cloneElement(child as ReactElement<TodoItemInternalProps>, { index: index++ });
  });

  return (
    <TodoContext.Provider
      value={{ onItemChange: (identifier, checked) => onChange?.(identifier, checked) }}
    >
      <div className={cx("eink-todo", [className ?? "", !!className])} {...rest}>
        {title && <div className="eink-todo__title">{title}</div>}
        {items}
      </div>
    </TodoContext.Provider>
  );
}

Todo.Item = TodoItem;
