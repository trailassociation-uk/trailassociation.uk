import { describe, expect, it } from "bun:test";
import {
  extractSubdomain,
  normalizeSubdomain,
  validateSubdomain,
} from "./association";

const APEX = "trailassociation.uk";

describe("extractSubdomain", () => {
  it("returns the subdomain for a host under the apex", () => {
    expect(extractSubdomain("peak-district.trailassociation.uk", APEX)).toBe(
      "peak-district",
    );
  });

  it("returns null for the apex host itself", () => {
    expect(extractSubdomain("trailassociation.uk", APEX)).toBeNull();
  });

  it("returns null for a www subdomain", () => {
    expect(extractSubdomain("www.trailassociation.uk", APEX)).toBeNull();
  });

  it("strips the port before extracting", () => {
    expect(
      extractSubdomain("peak-district.trailassociation.uk:3000", APEX),
    ).toBe("peak-district");
  });

  it("strips the port from the apex host", () => {
    expect(extractSubdomain("trailassociation.uk:3000", APEX)).toBeNull();
  });

  it("lowercases the host", () => {
    expect(extractSubdomain("Peak-District.TrailAssociation.UK", APEX)).toBe(
      "peak-district",
    );
  });

  it("matches the apex case-insensitively", () => {
    expect(
      extractSubdomain(
        "peak-district.trailassociation.uk",
        "TrailAssociation.UK",
      ),
    ).toBe("peak-district");
  });

  it("keeps the full label chain for nested subdomains", () => {
    expect(extractSubdomain("a.b.trailassociation.uk", APEX)).toBe("a.b");
  });

  it("returns null for a host that does not sit under the apex", () => {
    expect(extractSubdomain("example.com", APEX)).toBeNull();
  });

  it("returns null for a host that only suffix-matches the apex", () => {
    // "eviltrailassociation.uk" ends with the apex string but is not under it.
    expect(extractSubdomain("eviltrailassociation.uk", APEX)).toBeNull();
  });

  it("returns null for an IP address", () => {
    expect(extractSubdomain("127.0.0.1", APEX)).toBeNull();
  });

  it("returns null for an internal hostname", () => {
    expect(extractSubdomain("localhost", APEX)).toBeNull();
  });

  it("returns null for an empty host", () => {
    expect(extractSubdomain("", APEX)).toBeNull();
  });

  it("returns null when the subdomain label is empty", () => {
    expect(extractSubdomain(".trailassociation.uk", APEX)).toBeNull();
  });
});

describe("normalizeSubdomain", () => {
  it("trims surrounding whitespace and lowercases", () => {
    expect(normalizeSubdomain("  Peak-District  ")).toBe("peak-district");
  });
});

describe("validateSubdomain", () => {
  it("accepts a valid lowercase, hyphenated slug", () => {
    expect(validateSubdomain("peak-district")).toBeNull();
  });

  it("accepts a slug with numbers", () => {
    expect(validateSubdomain("trail99")).toBeNull();
  });

  it("rejects a slug that is too short", () => {
    expect(validateSubdomain("ab")).toMatch(/at least/);
  });

  it("rejects a slug that is too long", () => {
    expect(validateSubdomain("a".repeat(64))).toMatch(/at most/);
  });

  it("rejects uppercase characters", () => {
    expect(validateSubdomain("PeakDistrict")).toMatch(/lowercase/);
  });

  it("rejects spaces and other unsafe characters", () => {
    expect(validateSubdomain("peak district")).toMatch(/lowercase/);
    expect(validateSubdomain("peak_district")).toMatch(/lowercase/);
    expect(validateSubdomain("peak.district")).toMatch(/lowercase/);
  });

  it("rejects a leading hyphen", () => {
    expect(validateSubdomain("-peak")).toMatch(/lowercase/);
  });

  it("rejects a trailing hyphen", () => {
    expect(validateSubdomain("peak-")).toMatch(/lowercase/);
  });

  it("rejects reserved subdomains", () => {
    expect(validateSubdomain("www")).toMatch(/reserved/);
    expect(validateSubdomain("api")).toMatch(/reserved/);
    expect(validateSubdomain("admin")).toMatch(/reserved/);
  });
});
