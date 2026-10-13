import { describe, expect, it } from "vitest";

import {
  validateDepotUpdate,
  validateInventoryAdjustment,
  validateStockLogFilters,
  validateCreateVehicle,
  validateUpdateVehicle,
} from "../src/validators/inventoryValidator.js";

describe("inventory validation", () => {
  it("accepts a valid stock adjustment and trims its reason", () => {
    expect(
      validateInventoryAdjustment({
        item: "water",
        change: -50,
        reason: "  damaged containers  ",
      }),
    ).toEqual({ item: "water", change: -50, reason: "damaged containers" });
  });

  it.each([
    [{ item: "fuel", change: 10, reason: "restock" }, "item must be one of"],
    [{ item: "water", change: 0, reason: "restock" }, "change must be a non-zero integer"],
    [{ item: "water", change: 10, reason: " " }, "reason must contain"],
  ])("rejects an invalid stock adjustment", (input, message) => {
    expect(() => validateInventoryAdjustment(input)).toThrow(message);
  });

  it("validates depot capacity", () => {
    expect(validateDepotUpdate({ dailyCapacity: 1500 })).toEqual({
      daily_capacity: 1500,
    });
    expect(() => validateDepotUpdate({ dailyCapacity: -1 })).toThrow(
      "dailyCapacity must be a non-negative integer",
    );
  });

  it("accepts an optional depot stock-log filter", () => {
    expect(validateStockLogFilters({})).toEqual({});
    expect(validateStockLogFilters({ depotId: " dep_01 " })).toEqual({
      depotId: "dep_01",
    });
    expect(() => validateStockLogFilters({ item: "water" })).toThrow(
      "Unknown field: item",
    );
  });

  it("validates dynamic vehicle input", () => {
    expect(validateCreateVehicle({ name: " Rescue Truck ", capacity: 450 })).toEqual({
      name: "Rescue Truck",
      capacity: 450,
    });
    expect(validateUpdateVehicle({ status: "busy" })).toEqual({ status: "busy" });
    expect(() => validateCreateVehicle({ name: "X", capacity: 0 })).toThrow();
    expect(() => validateUpdateVehicle({ status: "offline" })).toThrow();
  });
});
