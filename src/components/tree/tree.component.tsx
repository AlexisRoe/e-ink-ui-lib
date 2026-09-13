import type { HTMLAttributes, ReactNode } from "react";
import { Children, createContext, isValidElement, useContext, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./tree.component.css";

interface TreeItemContextValue {
  /** Whether this item is the last child among its siblings, so its connector line stops at the branch. */
  isLast: boolean;
}

const TreeItemContext = createContext<TreeItemContextValue>({ isLast: true });

/** Props accepted by {@link Tree.Item}. */
export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "onClick"> {
  /** Label shown next to the branch/leaf icon. */
  label: ReactNode;
  /** Nested {@link Tree.Item} elements. When present, this item renders as an expandable branch. */
  children?: ReactNode;
  /** Whether the branch starts expanded. Defaults to `true`. Ignored on leaf items (no children). */
  initialExpanded?: boolean;
}

/**
 * Single node in a {@link Tree}, connected to its siblings and parent by
 * guide lines. Renders as an expandable branch (folder) when it has nested
 * `Tree.Item` children, or as a leaf (file) otherwise.
 *
 * @example
 * ```tsx
 * <Tree.Item label="src">
 *   <Tree.Item label="index.ts" />
 * </Tree.Item>
 * ```
 */
function TreeItem({ className, label, children, initialExpanded = true, ...rest }: TreeItemProps) {
  const { isLast } = useContext(TreeItemContext);
  const [expanded, setExpanded] = useState(initialExpanded);
  const hasChildren = children != null && children !== false;

  return (
    <li
      className={cx(
        "eink-tree-item",
        ["eink-tree-item--last", isLast],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      <div className="eink-tree-item__row">
        {hasChildren ? (
          <button
            type="button"
            className="eink-tree-item__toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <Icon
              className="eink-tree-item__chevron"
              name={expanded ? "chevron-down" : "chevron-right"}
            />
            <Icon className="eink-tree-item__icon" name="folder" />
            <span className="eink-tree-item__label">{label}</span>
          </button>
        ) : (
          <span className="eink-tree-item__leaf">
            <Icon className="eink-tree-item__icon" name="file" />
            <span className="eink-tree-item__label">{label}</span>
          </span>
        )}
      </div>
      {hasChildren && expanded && <TreeGroup isRoot={false}>{children}</TreeGroup>}
    </li>
  );
}

interface TreeGroupProps {
  children: ReactNode;
  isRoot: boolean;
}

function TreeGroup({ children, isRoot }: TreeGroupProps) {
  const items = Children.toArray(children);

  return (
    <ul className={cx("eink-tree-group", ["eink-tree-group--nested", !isRoot])}>
      {items.map((child, index) => (
        <TreeItemContext.Provider
          key={isValidElement(child) ? child.key : index}
          value={{ isLast: index === items.length - 1 }}
        >
          {child}
        </TreeItemContext.Provider>
      ))}
    </ul>
  );
}

/** Props accepted by {@link Tree}. */
export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** {@link Tree.Item} elements forming the top level of the tree. */
  children: ReactNode;
}

/**
 * A hierarchical folder/file tree with guide lines connecting each node to
 * its siblings and parent. Composes {@link Tree.Item}, which can itself
 * nest further `Tree.Item`s to form branches; branches are expandable and
 * collapsible.
 *
 * @example
 * ```tsx
 * <Tree>
 *   <Tree.Item label="src">
 *     <Tree.Item label="components">
 *       <Tree.Item label="button.tsx" />
 *     </Tree.Item>
 *     <Tree.Item label="index.ts" />
 *   </Tree.Item>
 * </Tree>
 * ```
 */
export function Tree({ className, children, ...rest }: TreeProps) {
  return (
    <div className={cx("eink-tree", [className ?? "", !!className])} {...rest}>
      <TreeGroup isRoot>{children}</TreeGroup>
    </div>
  );
}

Tree.Item = TreeItem;
