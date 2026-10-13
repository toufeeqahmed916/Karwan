import { describe, expect, it } from "vitest";

import {
  validateApproveAllocation,
  validateGenerateAllocation,
} from "../src/validators/allocationValidator.js";

describe("allocation validation", () => {
  it("accepts the agreed generation and approval bodies", () => {
    expect(validateGenerateAllocation({})).toBeUndefined();
    expect(validateApproveAllocation({ all: true })).toEqual({ all: true });
    expect(validateApproveAllocation({ rowIds: ["alc_01", "alc_01", "alc_02"] })).toEqual({
      all: false,
      rowIds: ["alc_01", "alc_02"],
    });
  });

  it("rejects ambiguous approval input", () => {
    expect(() => validateApproveAllocation({ all: true, rowIds: ["alc_01"] })).toThrow(
      "Provide either",
    );
  });
});
