import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

describe("application foundation", () => {
  it("reports that the HTTP process is live", async () => {
    const response = await request(createApp()).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: "ok",
        service: "karwan-backend",
      },
    });
  });

  it("returns the agreed error envelope for unknown routes", async () => {
    const response = await request(createApp()).get("/api/not-a-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Route not found: GET /api/not-a-route",
      },
    });
  });
});
