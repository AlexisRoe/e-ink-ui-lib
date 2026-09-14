import { describe, expect, it } from "vitest";
import {
  combineValidators,
  isEmail,
  isEnum,
  isMaxLength,
  isNumeric,
  isRequired,
  isString,
  isUrl,
} from "./validate.utils";

describe("isRequired", () => {
  it("fails on empty or whitespace-only strings", () => {
    expect(isRequired("")).toBe("This field is required.");
    expect(isRequired("   ")).toBe("This field is required.");
  });

  it("passes on non-empty strings", () => {
    expect(isRequired("hi")).toBeNull();
  });
});

describe("isString", () => {
  it("fails on non-strings", () => {
    expect(isString(42)).toBe("Must be text.");
  });

  it("fails when shorter than min", () => {
    expect(isString("ab", 3)).toBe("Must be at least 3 characters.");
  });

  it("passes valid strings", () => {
    expect(isString("abc", 3)).toBeNull();
  });
});

describe("isMaxLength", () => {
  it("fails when longer than max", () => {
    expect(isMaxLength("abcdef", 5)).toBe("Must be at most 5 characters.");
  });

  it("passes within max", () => {
    expect(isMaxLength("abc", 5)).toBeNull();
  });
});

describe("isEmail", () => {
  it("passes empty values", () => {
    expect(isEmail("")).toBeNull();
  });

  it("fails malformed addresses", () => {
    expect(isEmail("not-an-email")).toBe("Must be a valid email address.");
  });

  it("passes valid addresses", () => {
    expect(isEmail("a.roehrling@gmx.de")).toBeNull();
  });
});

describe("isUrl", () => {
  it("passes empty values", () => {
    expect(isUrl("")).toBeNull();
  });

  it("fails malformed urls", () => {
    expect(isUrl("not a url")).toBe("Must be a valid URL.");
  });

  it("passes valid urls", () => {
    expect(isUrl("https://example.com")).toBeNull();
  });
});

describe("isEnum", () => {
  it("passes empty values", () => {
    expect(isEnum("", ["a", "b"])).toBeNull();
  });

  it("fails values outside the options", () => {
    expect(isEnum("c", ["a", "b"])).toBe("Must be one of: a, b.");
  });

  it("passes values within the options", () => {
    expect(isEnum("a", ["a", "b"])).toBeNull();
  });
});

describe("isNumeric", () => {
  it("passes empty values", () => {
    expect(isNumeric("")).toBeNull();
  });

  it("fails non-digit values", () => {
    expect(isNumeric("12a")).toBe("Must contain only digits.");
  });

  it("passes digit-only values", () => {
    expect(isNumeric("123")).toBeNull();
  });
});

describe("combineValidators", () => {
  it("returns the first failing validator's message", () => {
    const validate = combineValidators(isRequired, (value) => isMaxLength(value, 3));
    expect(validate("")).toBe("This field is required.");
    expect(validate("abcd")).toBe("Must be at most 3 characters.");
    expect(validate("ab")).toBeNull();
  });
});
