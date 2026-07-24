import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent-green text-text-on-accent hover:bg-accent-green-hover",
  outline:
    "border border-border-default text-text-secondary hover:border-text-secondary hover:text-text-primary",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
