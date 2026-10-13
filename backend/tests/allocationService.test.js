import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/allocationRepository.js", () => ({
  findActiveRoadBlocks: vi.fn(),
  findSavedAllocations: vi.fn(),
  insertApprovedAllocations: vi.fn(),
  insertDispatchLogs: vi.fn(),
  updateInventoryQuantity: vi.fn(),
  updateRequestItemAllocation: vi.fn(),
  updateRequestStatus: vi.fn(),
}));
vi.mock("../src/repositories/scoringRepository.js", () => ({
  findRequestsForScoring: vi.fn(),
}));
vi.mock("../src/repositories/settingsRepository.js", () => ({
  findTimeOffsetHours: vi.fn(),
  findWeights: vi.fn(),
}));
vi.mock("../src/services/inventoryService.js", () => ({
  listDepots: vi.fn(),
}));
vi.mock("../src/services/requestService.js", () => ({
  listRequests: vi.fn(),
}));

import {
  findActiveRoadBlocks,
  insertApprovedAllocations,
  insertDispatchLogs,
  updateInventoryQuantity,
  updateRequestItemAllocation,
  updateRequestStatus,
} from "../src/repositories/allocationRepository.js";
import { findRequestsForScoring } from "../src/repositories/scoringRepository.js";
import {
  findTimeOffsetHours,
  findWeights,
} from "../src/repositories/settingsRepository.js";
import {
  approveAllocation,
  generateAllocation,
} from "../src/services/allocationService.js";
import { listDepots } from "../src/services/inventoryService.js";
import { listRequests } from "../src/services/requestService.js";

const weights = {
  urgency: 0.35,
  population: 0.25,
  vulnerability: 0.15,
  waiting: 0.15,
  accessibility: 0.1,
};
const requestRows = [
  {
    id: "req_01",
    area: "Dadu",
    lat: 26.73,
    lng: 67.78,
    population: 4200,
    urgency: "critical",
    vulnerable: true,
    accessibility: "hard",
    status: "pending",
    created_at: "2026-10-12T10:00:00Z",
    request_items: [{ item: "water", qty_needed: 500, qty_allocated: 0 }],
  },
];
const depots = [
  {
    id: "dep_01",
    name: "Hyderabad Depot",
    lat: 25.396,
    lng: 68.3578,
    dailyCapacity: 2000,
    stock: [{ item: "water", qty: 1200, lowThreshold: 300, isLow: false }],
    vehicles: [{ id: "veh_01", capacity: 400, status: "available" }],
  },
];

describe("allocation service approval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findRequestsForScoring.mockResolvedValue(requestRows);
    findWeights.mockResolvedValue(weights);
    findTimeOffsetHours.mockResolvedValue(0);
    findActiveRoadBlocks.mockResolvedValue([]);
    listDepots.mockResolvedValue(depots);
    listRequests.mockResolvedValue([{ id: "req_01", status: "allocated" }]);
    updateInventoryQuantity.mockResolvedValue(true);
    insertApprovedAllocations.mockResolvedValue([{ id: "saved" }]);
  });

  it("deducts stock, saves rows and updates request fulfilment on approval", async () => {
    const plan = await generateAllocation({});
    const result = await approveAllocation({ all: true });

    expect(plan.rows).toHaveLength(1);
    expect(updateInventoryQuantity).toHaveBeenCalledWith({
      depotId: "dep_01",
      item: "water",
      oldQty: 1200,
      newQty: 700,
    });
    expect(insertApprovedAllocations).toHaveBeenCalledOnce();
    expect(insertDispatchLogs).toHaveBeenCalledOnce();
    expect(updateRequestItemAllocation).toHaveBeenCalledWith({
      requestId: "req_01",
      item: "water",
      qtyAllocated: 500,
    });
    expect(updateRequestStatus).toHaveBeenCalledWith("req_01", "allocated");
    expect(result.approved).toBe(1);
  });
});
