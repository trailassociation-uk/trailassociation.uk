import { describe, expect, it } from "bun:test";
import { isReservedSubdomain } from "./reserved-subdomains";

describe("isReservedSubdomain", () => {
  it("returns true for reserved platform slugs", () => {
    expect(isReservedSubdomain("www")).toBe(true);
    expect(isReservedSubdomain("api")).toBe(true);
    expect(isReservedSubdomain("app")).toBe(true);
    expect(isReservedSubdomain("admin")).toBe(true);
  });

  it("returns false for an ordinary association slug", () => {
    expect(isReservedSubdomain("peak-district")).toBe(false);
  });

  it("normalises the input so callers don't have to", () => {
    expect(isReservedSubdomain("API")).toBe(true);
    expect(isReservedSubdomain("  api  ")).toBe(true);
  });

});
