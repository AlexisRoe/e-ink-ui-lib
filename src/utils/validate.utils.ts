/**
 * Small set of composable validators for form fields, each returning an
 * error message string when the value is invalid, or `null` when it's
 * valid. Intended for use as (or inside) an `Input`'s `validate` callback.
 *
 * @example
 * ```tsx
 * <Input validate={(value) => isEmail(value) ?? isRequired(value)} />
 * ```
 */

/** Fails when `value` is empty or only whitespace. */
export function isRequired(value: string, message = "This field is required."): string | null {
  return value.trim().length === 0 ? message : null;
}

/** Fails when `value` isn't a plain string, or (when given) is shorter than `min` characters. */
export function isString(value: unknown, min?: number, message?: string): string | null {
  if (typeof value !== "string") return message ?? "Must be text.";
  if (min !== undefined && value.length < min) {
    return message ?? `Must be at least ${min} characters.`;
  }
  return null;
}

/** Fails when `value` is longer than `max` characters. */
export function isMaxLength(value: string, max: number, message?: string): string | null {
  return value.length > max ? (message ?? `Must be at most ${max} characters.`) : null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fails when non-empty `value` isn't a plausible email address. */
export function isEmail(value: string, message = "Must be a valid email address."): string | null {
  if (value.length === 0) return null;
  return EMAIL_PATTERN.test(value) ? null : message;
}

const URL_PATTERN = /^https?:\/\/[^\s]+\.[^\s]+$/;

/** Fails when non-empty `value` isn't a plausible `http(s)://` URL. */
export function isUrl(value: string, message = "Must be a valid URL."): string | null {
  if (value.length === 0) return null;
  return URL_PATTERN.test(value) ? null : message;
}

/** Fails when non-empty `value` isn't one of `options`. */
export function isEnum<T extends string>(
  value: string,
  options: readonly T[],
  message?: string,
): string | null {
  if (value.length === 0) return null;
  return (options as readonly string[]).includes(value)
    ? null
    : (message ?? `Must be one of: ${options.join(", ")}.`);
}

/** Fails when non-empty `value` contains non-digit characters. */
export function isNumeric(value: string, message = "Must contain only digits."): string | null {
  if (value.length === 0) return null;
  return /^\d+$/.test(value) ? null : message;
}

/**
 * Combines validators, running each in order and returning the first error
 * found, or `null` if all pass.
 *
 * @example
 * ```tsx
 * validate={combineValidators(isRequired, (v) => isMaxLength(v, 20))}
 * ```
 */
export function combineValidators(
  ...validators: Array<(value: string) => string | null | undefined>
): (value: string) => string | null {
  return (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}
