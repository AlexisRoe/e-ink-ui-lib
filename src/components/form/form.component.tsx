import type { FormEvent, FormHTMLAttributes, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { shallowEqual } from "../../utils/shallow-equal.utils";
import { Button } from "../button/button.component";
import type { FormContextValue, FormValues } from "./form.context";
import { FormContext, useFormContext } from "./form.context";
import "./form.component.css";

/** Props accepted by {@link Form}. */
export interface FormProps<TValues extends FormValues = FormValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onReset" | "children"> {
  /** Field values the form starts with, and returns to on reset. */
  initialValues: TValues;
  /** Called with the current values when the form is submitted (native submit event, already prevented). */
  onSubmit?: (values: TValues, event: FormEvent<HTMLFormElement>) => void;
  /** Called with the restored initial values right after a reset. */
  onReset?: (values: TValues) => void;
  /**
   * Overrides how `values` is compared against `initialValues` to compute
   * dirtiness. Defaults to a shallow (top-level, `===` per key) comparison.
   * Receives `(initialValues, values)`.
   */
  isEqual?: (initialValues: TValues, values: TValues) => boolean;
  children: ReactNode;
}

/**
 * Wraps a native `<form>` and provides form state (values, errors, dirty/
 * error status) to descendants via context, for input components to read
 * and update through {@link useFormContext}/`useFormField`.
 *
 * Submitting is only meaningful once the data has actually changed and no
 * field has an error — {@link Form.SubmitButton} enforces this by disabling
 * itself automatically. Resetting restores `initialValues` and clears all
 * errors — {@link Form.ResetButton} triggers it.
 *
 * Dirtiness is computed with a shallow comparison of `values` against
 * `initialValues` by default; pass `isEqual` to supply your own comparison
 * (e.g. a deep-equal) when shallow equality isn't sufficient.
 *
 * `initialValues` is tracked automatically: whenever the prop shallowly
 * changes (e.g. async data finishes loading), the form re-syncs `values` to
 * it and clears errors, as if freshly mounted.
 *
 * @example
 * ```tsx
 * <Form
 *   initialValues={{ name: "" }}
 *   onSubmit={(values) => save(values)}
 * >
 *   <Form.SubmitButton>Save</Form.SubmitButton>
 *   <Form.ResetButton>Reset</Form.ResetButton>
 * </Form>
 * ```
 */
export function Form<TValues extends FormValues = FormValues>({
  className,
  initialValues,
  onSubmit,
  onReset,
  isEqual,
  children,
  ...rest
}: FormProps<TValues>) {
  const [initial, setInitial] = useState(initialValues);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!shallowEqual(initial, initialValues)) {
    setInitial(initialValues);
    setValues(initialValues);
    setErrors({});
  }

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const getValue = useCallback((name: string) => values[name], [values]);

  const setError = useCallback((name: string, error: string | undefined) => {
    setErrors((current) => {
      if (!error) {
        if (!(name in current)) return current;
        const { [name]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [name]: error };
    });
  }, []);

  const getError = useCallback((name: string) => errors[name], [errors]);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    onReset?.(initial);
  }, [initial, onReset]);

  const isDirty = useMemo(
    () => !(isEqual ?? shallowEqual)(initial, values),
    [isEqual, initial, values],
  );
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const contextValue = useMemo<FormContextValue<TValues>>(
    () => ({
      values,
      initialValues: initial,
      errors,
      isDirty,
      hasErrors,
      setValue,
      getValue,
      setError,
      getError,
      reset,
    }),
    [values, initial, errors, isDirty, hasErrors, setValue, getValue, setError, getError, reset],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || hasErrors) return;
    onSubmit?.(values, event);
  };

  return (
    <FormContext.Provider value={contextValue as FormContextValue}>
      <form
        className={cx("eink-form", [className ?? "", !!className])}
        onSubmit={handleSubmit}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

/** Props accepted by {@link Form.SubmitButton} and {@link Form.ResetButton}: only a label. */
export interface FormActionButtonProps {
  /** Label rendered inside the button. */
  children: ReactNode;
}

/**
 * Primary submit button for a {@link Form}. Disabled automatically while
 * the form has no unsaved changes or has a validation error. Only accepts a
 * `children` label — everything else is wired to the enclosing form.
 */
function SubmitButton({ children }: FormActionButtonProps) {
  const { isDirty, hasErrors } = useFormContext();

  return (
    <Button type="submit" disabled={!isDirty || hasErrors}>
      {children}
    </Button>
  );
}

/**
 * Outline reset button for a {@link Form}. Restores `initialValues` and
 * clears all errors when clicked, then calls the form's `onReset`. Only
 * accepts a `children` label — everything else is wired to the enclosing
 * form.
 */
function ResetButton({ children }: FormActionButtonProps) {
  const { reset } = useFormContext();

  return (
    <Button.Outlined type="button" onClick={reset}>
      {children}
    </Button.Outlined>
  );
}

Form.SubmitButton = SubmitButton;
Form.ResetButton = ResetButton;
