import request from "supertest"
import app from "../src/app"

describe("Health Check", () => {
  it("should return OK", async () => {
    const res = await request(app).get("/health")

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      status: "ok"
    })
  })
})