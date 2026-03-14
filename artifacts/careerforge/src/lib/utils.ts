import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useAuthHeaders() {
  const token = localStorage.getItem("careerforge_token");
  return {
    request: {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  };
}

export function buttonVariants({ variant = "default", size = "default", className }: { variant?: "default" | "outline" | "ghost" | "link" | "secondary"; size?: "default" | "sm" | "lg" | "icon"; className?: string }) {
  const variants = {
    default: "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
    outline: "border-2 border-input bg-background hover:bg-secondary hover:text-secondary-foreground",
    ghost: "hover:bg-secondary hover:text-secondary-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-xl px-8",
    icon: "h-11 w-11",
  };

  return `${variants[variant]} ${sizes[size]} ${className || ""}`;
}
