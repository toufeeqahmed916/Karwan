import { SUPPLY_ITEMS, VEHICLE_STATUSES } from "../constants/enums.js";
import { AppError } from "../errors/AppError.js";

const INVENTORY_FIELDS = new Set(["item", "change", "reason"]);
const DEPOT_FIELDS = new Set(["dailyCapacity"]);
const LOG_FILTER_FIELDS = new Set(["depotId"]);
const VEHICLE_CREATE_FIELDS = new Set(["name", "capacity"]);
const VEHICLE_UPDATE_FIELDS = new Set(["status"]);

function invalid(message) {
  throw new AppError({
    code: "VALIDATION_ERROR",
    message,
    statusCode: 400,
  });
}

function requireObject(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    invalid("Request body must be a JSON object");
  }
}

function rejectUnknownFields(input, allowedFields) {
  const unknown = Object.keys(input).filter((key) => !allowedFields.has(key));
  if (unknown.length > 0) {
    invalid(`Unknown field: ${unknown[0]}`);
  }
}

export function validateInventoryAdjustment(input) {
  requireObject(input);
  rejectUnknownFields(input, INVENTORY_FIELDS);

  if (!SUPPLY_ITEMS.includes(input.item)) {
    invalid(`item must be one of: ${SUPPLY_ITEMS.join(", ")}`);
  }
  if (!Number.isInteger(input.change) || input.change === 0) {
    invalid("change must be a non-zero integer");
  }

  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (reason.length < 2 || reason.length > 240) {
    invalid("reason must contain between 2 and 240 characters");
  }

  return { item: input.item, change: input.change, reason };
}

export function validateDepotUpdate(input) {
  requireObject(input);
  rejectUnknownFields(input, DEPOT_FIELDS);

  if (!Number.isInteger(input.dailyCapacity) || input.dailyCapacity < 0) {
    invalid("dailyCapacity must be a non-negative integer");
  }

  return { daily_capacity: input.dailyCapacity };
}

export function validateStockLogFilters(query = {}) {
  rejectUnknownFields(query, LOG_FILTER_FIELDS);

  if (query.depotId === undefined) {
    return {};
  }

  const depotId = typeof query.depotId === "string" ? query.depotId.trim() : "";
  if (!depotId) {
    invalid("depotId cannot be empty");
  }

  return { depotId };
}

export function validateCreateVehicle(input) {
  requireObject(input);
  rejectUnknownFields(input, VEHICLE_CREATE_FIELDS);
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 2 || name.length > 80) {
    invalid("name must contain between 2 and 80 characters");
  }
  if (!Number.isInteger(input.capacity) || input.capacity <= 0) {
    invalid("capacity must be a positive integer");
  }
  return { name, capacity: input.capacity };
}

export function validateUpdateVehicle(input) {
  requireObject(input);
  rejectUnknownFields(input, VEHICLE_UPDATE_FIELDS);
  if (!VEHICLE_STATUSES.includes(input.status)) {
    invalid(`status must be one of: ${VEHICLE_STATUSES.join(", ")}`);
  }
  return { status: input.status };
}
