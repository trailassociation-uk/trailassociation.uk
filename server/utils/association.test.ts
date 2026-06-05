import { describe, expect, it } from "bun:test";
import { extractSubdomain } from "./association";

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
    expect(extractSubdomain("peak-district.trailassociation.uk:3000", APEX)).toBe(
      "peak-district",
    );
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
      extractSubdomain("peak-district.trailassociation.uk", "TrailAssociation.UK"),
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
