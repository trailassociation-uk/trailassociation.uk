import { describe, expect, test } from "bun:test";
import { fromDatetimeLocal, toDatetimeLocal } from "./events";

describe("toDatetimeLocal", () => {
  test("produces a valid datetime-local value", () => {
    const value = toDatetimeLocal("2026-06-21T09:30:00.000Z");
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  test("pads single-digit components", () => {
    // 5 Jan, 08:05 local time.
    const local = new Date(2026, 0, 5, 8, 5);
    expect(toDatetimeLocal(local.toISOString())).toBe("2026-01-05T08:05");
  });
});

describe("fromDatetimeLocal", () => {
  test("returns null for an empty value", () => {
    expect(fromDatetimeLocal("")).toBeNull();
  });

  test("round-trips with toDatetimeLocal", () => {
    const iso = "2026-06-21T09:30:00.000Z";
    expect(fromDatetimeLocal(toDatetimeLocal(iso))).toBe(iso);
  });

  test("interprets the value as local time", () => {
    const local = new Date(2026, 5, 21, 10, 0);
    expect(fromDatetimeLocal("2026-06-21T10:00")).toBe(local.toISOString());
  });
});
