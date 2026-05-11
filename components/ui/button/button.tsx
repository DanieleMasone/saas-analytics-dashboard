import type {ButtonHTMLAttributes} from "react";
import {cn} from "@/lib/utils/utils";

/** Visual intent variants supported by the shared button primitive. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

/** Fixed button sizes used across the dashboard toolbar and actions. */
export type ButtonSize = "sm" | "md" | "icon";

/** Props for the shared button primitive. */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
    danger:
        "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200 dark:hover:bg-rose-950/50",
    ghost:
        "border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    primary:
        "border border-cyan-700 bg-cyan-700 text-white hover:bg-cyan-800 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400",
    secondary:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
};

const sizes: Record<ButtonSize, string> = {
    icon: "h-9 w-9 p-0",
    md: "h-10 px-3",
    sm: "h-8 px-2.5 text-sm",
};

/** Small design-system button primitive shared by dashboard actions. */
export function Button({
                           className,
                           size = "md",
                           type = "button",
                           variant = "secondary",
                           ...props
                       }: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant],
                sizes[size],
                className,
            )}
            type={type}
            {...props}
        />
    );
}
