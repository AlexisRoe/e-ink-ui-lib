import type { HTMLAttributes, ReactElement } from "react";
import { Children, isValidElement, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { Card } from "../card/card.component";
import type { SegmentedItemProps } from "../segmented/segmented.component";
import { Segmented } from "../segmented/segmented.component";

import "./tabs.component.css";

/** Props accepted by {@link Tabs}. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** `id` of the {@link Tabs.Item} selected when the component first renders. Defaults to the first item. */
  defaultId?: string;
  /** Stretches the content panel to fill the available height of the parent. Defaults to `false`. */
  fullHeight?: boolean;
  /** Called with the `id` of the tab that was clicked. */
  onChange?: (id: string) => void;
}

/** Props accepted by {@link Tabs.Content}. */
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Matches this content panel to the {@link Tabs.Item} with the same `id`. */
  id: string;
}

/**
 * Content panel shown when the {@link Tabs.Item} with the same `id` is
 * selected. Rendered full-width, styled like a {@link Card}, flush against
 * the tab row above it (no gap, single shared border line).
 *
 * @example
 * ```tsx
 * <Tabs.Content id="overview">Summary of account activity.</Tabs.Content>
 * ```
 */
function TabsContent({ className, id: _id, children, ...rest }: TabsContentProps) {
  return (
    <Card className={cx("eink-tabs__content", [className ?? "", !!className])} {...rest}>
      {children}
    </Card>
  );
}

/**
 * Full-width tab row with a {@link Card}-like content panel below it.
 * Composes {@link Segmented}/{@link Segmented.Item} for the tab row and
 * shows the {@link Tabs.Content} whose `id` matches the selected
 * {@link Tabs.Item}.
 *
 * @example
 * ```tsx
 * <Tabs defaultId="overview" onChange={(id) => track(id)}>
 *   <Tabs.Item id="overview">Overview</Tabs.Item>
 *   <Tabs.Item id="details">Details</Tabs.Item>
 *   <Tabs.Content id="overview">Summary of account activity.</Tabs.Content>
 *   <Tabs.Content id="details">Granular line items and timestamps.</Tabs.Content>
 * </Tabs>
 * ```
 */
export function Tabs({
  className,
  children,
  defaultId,
  fullHeight = false,
  onChange,
  ...rest
}: TabsProps) {
  const items: ReactElement<SegmentedItemProps>[] = [];
  const contents: ReactElement<TabsContentProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === Segmented.Item) {
      items.push(child as ReactElement<SegmentedItemProps>);
    } else if (child.type === TabsContent) {
      contents.push(child as ReactElement<TabsContentProps>);
    }
  });

  const [activeId, setActiveId] = useState<string | null>(defaultId ?? items[0]?.props.id ?? null);

  const handleChange = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  const activeContent = contents.find((content) => content.props.id === activeId);

  return (
    <div
      className={cx(
        "eink-tabs",
        [className ?? "", !!className],
        ["eink-tabs--full-height", fullHeight],
      )}
      {...rest}
    >
      <Segmented fullWidth defaultId={activeId ?? undefined} onChange={handleChange}>
        {items}
      </Segmented>
      {activeContent}
    </div>
  );
}

Tabs.Item = Segmented.Item;
Tabs.Content = TabsContent;

/** Props accepted by {@link Tabs.Item}, an alias of {@link Segmented.Item}. */
export type TabsItemProps = SegmentedItemProps;
