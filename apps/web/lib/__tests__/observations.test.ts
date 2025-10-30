import { describe, it, expect } from "vitest";
import { SAMPLE_OBSERVATIONS } from "@/lib/static-data";

describe("Observation feed fallback", () => {
  it("provides deterministic sample data", () => {
    expect(SAMPLE_OBSERVATIONS.length).toBeGreaterThan(0);
    const first = SAMPLE_OBSERVATIONS[0];
    expect(first).toHaveProperty("state");
    expect(first).toHaveProperty("fee");
  });
});
