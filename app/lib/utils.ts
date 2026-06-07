import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractErrorMessage(
  e: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (e && typeof e === "object" && "data" in e) {
    const data = (e as { data?: { message?: string } }).data;
    return data?.message ?? fallback;
  }
  return fallback;
}

/** Derive a URL-safe subdomain suggestion from a free-text name. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}
