import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("utility classnames", () => {
  it("joins truthy values", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
