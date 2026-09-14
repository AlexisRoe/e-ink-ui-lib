import { createContext, useContext } from "react";

/** Plain record of field name to field value, as stored by {@link Form}. */
export type FormValues = Record<string, unknown>;

/** Value exposed by {@link Form} through context to its descendants. */
export interface FormContextValue<TValues extends FormValues = FormValues> {
  /** Current field values. */
  values: TValues;
  /** Field values the form was initialized (or last reset) with. */
  initialValues: TValues;
  /** Current validation errors, keyed by field name. A missing key means no error. */
  errors: Record<string, string>;
  /** True when `values` differs from `initialValues` (see `isEqual` on {@link Form}). */
  isDirty: boolean;
  /** True when any field currently has an error. */
  hasErrors: boolean;
  /** Updates a single field's value. */
  setValue: (name: string, value: unknown) => void;
  /** Reads a single field's current value. */
  getValue: (name: string) => unknown;
  /** Sets or clears (pass `undefined`) a single field's error. */
  setError: (name: string, error: string | undefined) => void;
  /** Reads a single field's current error, if any. */
  getError: (name: string) => string | undefined;
  /** Resets all values to `initialValues` and clears all errors. */
  reset: () => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

/**
 * Reads the enclosing {@link Form}'s state and update methods. Intended for
 * input components that need to read/write a field's value or error.
 *
 * Throws if used outside a `<Form>`.
 *
 * @example
 * ```tsx
 * const { getValue, setValue, getError, setError } = useFormContext();
 * ```
 */
export function useFormContext<
  TValues extends FormValues = FormValues,
>(): FormContextValue<TValues> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a <Form>");
  }
  return context as FormContextValue<TValues>;
}

/** Value returned by {@link useFormField}. */
export interface FormFieldState {
  /** The field's current value. */
  value: unknown;
  /** The field's current error, if any. */
  error: string | undefined;
  /** Updates the field's value. */
  setValue: (value: unknown) => void;
  /** Sets or clears (pass `undefined`) the field's error. */
  setError: (error: string | undefined) => void;
}

/**
 * Convenience hook for a single named field, built on {@link useFormContext}.
 * Intended for input components (built separately) to wire themselves up to
 * the enclosing `<Form>` in one call.
 *
 * Throws if used outside a `<Form>`.
 *
 * @example
 * ```tsx
 * const { value, error, setValue } = useFormField("email");
 * ```
 */
export function useFormField(name: string): FormFieldState {
  const { getValue, setValue, getError, setError } = useFormContext();

  return {
    value: getValue(name),
    error: getError(name),
    setValue: (value: unknown) => setValue(name, value),
    setError: (error: string | undefined) => setError(name, error),
  };
}
