import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { Container } from "../container/container.component";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";
import { Text } from "../text/text.component";
import { Title } from "../title/title.component";

import "./state.component.css";

/** Action button shown at the bottom of a state, given a label and a callback. */
export interface StateAction {
  /** Label shown on the action button. */
  label: string;
  /** Called when the action button is clicked. */
  onClick: () => void;
}

/** Props shared by {@link State.Empty} and {@link State.Error}. */
export interface StateVariantProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title shown below the icon. */
  title: string;
  /** Optional subtitle shown below the title. */
  subtitle?: string;
  /** Optional longer description shown below the subtitle. */
  description?: string;
  /** Optional action button, given a label and a callback. */
  action?: StateAction;
  /** Renders a border around the state. Defaults to `true`. */
  withBorder?: boolean;
}

interface BaseStateProps extends StateVariantProps {
  icon: IconName;
  actionVariant: "filled" | "outlined";
}

function BaseState({
  className,
  icon,
  title,
  subtitle,
  description,
  action,
  actionVariant,
  withBorder = true,
  ...rest
}: BaseStateProps) {
  const ActionButton = actionVariant === "outlined" ? Button.Outlined : Button;

  return (
    <Container
      data-eink-component="state"
      className={cx("eink-state", [className ?? "", !!className])}
      withBorder={withBorder}
      fullWidth
      fullHeight
      centered
      {...rest}
    >
      <div className="eink-state__content">
        <Icon name={icon} size={64} className="eink-state__icon" aria-hidden="true" />
        <Title size={3} className="eink-state__title">
          {title}
        </Title>
        {subtitle && <Text className="eink-state__subtitle">{subtitle}</Text>}
        {description && <Text className="eink-state__description">{description}</Text>}
        {action && (
          <ActionButton className="eink-state__action" onClick={action.onClick}>
            {action.label}
          </ActionButton>
        )}
      </div>
    </Container>
  );
}

/**
 * Full-width, full-height, centered empty state: a large search-ipad icon,
 * a required title, and optional subtitle, description, and action button
 * (rendered as {@link Button.Outlined}).
 *
 * @example
 * ```tsx
 * <State.Empty
 *   title="Nothing here yet"
 *   description="Items you add will show up here."
 *   action={{ label: "Add item", onClick: handleAdd }}
 * />
 * ```
 */
function Empty(props: StateVariantProps) {
  return (
    <BaseState
      {...props}
      icon="device-ipad-horizontal-search"
      actionVariant="outlined"
      className={cx("eink-state--empty", [props.className ?? "", !!props.className])}
    />
  );
}

/**
 * Full-width, full-height, centered error state: a large bug icon, a
 * required title, and optional subtitle, description, and action button
 * (rendered as the filled {@link Button}).
 *
 * @example
 * ```tsx
 * <State.Error
 *   title="Something went wrong"
 *   description="Please try again."
 *   action={{ label: "Retry", onClick: handleRetry }}
 * />
 * ```
 */
function ErrorState(props: StateVariantProps) {
  return (
    <BaseState
      {...props}
      icon="bug"
      actionVariant="filled"
      className={cx("eink-state--error", [props.className ?? "", !!props.className])}
    />
  );
}

/**
 * Namespace for the {@link Empty} and {@link ErrorState} state components — full
 * page/section placeholders shown when there is no content or a failure
 * occurred. Both render inside a full-width, full-height, centered
 * {@link Container} with a large icon, a required title, and optional
 * subtitle, description, and action button.
 *
 * @example
 * ```tsx
 * <State.Empty title="Nothing here yet" />
 * <State.Error title="Something went wrong" action={{ label: "Retry", onClick: retry }} />
 * ```
 */
export const State = {
  Empty,
  Error: ErrorState,
};
