import { describe, expect, it } from "bun:test";
import { slugify } from "./utils";

describe("slugify", () => {
  it("lowercases and trims", () => {
    expect(slugify("  Peak District  ")).toBe("peak-district");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("Peak District Trail Association")).toBe(
      "peak-district-trail-association",
    );
  });

  it("collapses runs of non-alphanumeric characters into a single hyphen", () => {
    expect(slugify("Peak  --  District")).toBe("peak-district");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("--peak-district--")).toBe("peak-district");
  });

  it("handles special characters", () => {
    expect(slugify("Côte d'Ivoire")).toBe("c-te-d-ivoire");
  });

  it("handles numbers", () => {
    expect(slugify("Trail 99")).toBe("trail-99");
  });

  it("truncates to 63 characters", () => {
    const long = "a".repeat(70);
    expect(slugify(long)).toHaveLength(63);
  });

  it("returns an empty string for an all-special-character input", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("returns an empty string for an empty input", () => {
    expect(slugify("")).toBe("");
  });
});
