import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const classes = ["eink-button", `eink-button--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
