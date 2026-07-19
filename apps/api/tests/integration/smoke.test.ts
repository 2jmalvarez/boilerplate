import request from "supertest";
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { pool } from "../../src/config/database.js";

const describeWithDatabase = process.env.TEST_DATABASE_URL
  ? describe
  : describe.skip;

describeWithDatabase("API smoke", () => {
  const email = `integration-${randomUUID()}@example.com`;

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [email]);
    await pool.end();
  });

  it("reports liveness", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body).toEqual({ data: { status: "ok" } });
  });

  it("reports database readiness", async () => {
    const response = await request(app).get("/ready").expect(200);
    expect(response.body).toEqual({ data: { status: "ready" } });
  });

  it("registers a user and manages an isolated task", async () => {
    const registration = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Integration User",
        email,
        password: "correct-horse-battery-staple",
      })
      .expect(201);

    const registrationBody = registration.body as {
      data: { accessToken: string };
    };
    const token = registrationBody.data.accessToken;
    expect(token).toBeTypeOf("string");

    const creation = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Verify boilerplate",
        status: "todo",
        dueDate: "2030-01-15",
      })
      .expect(201);

    const creationBody = creation.body as {
      data: { id: string; title: string };
    };
    const taskId = creationBody.data.id;
    expect(creationBody.data.title).toBe("Verify boilerplate");

    const update = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "done" })
      .expect(200);
    const updateBody = update.body as { data: { status: string } };
    expect(updateBody.data.status).toBe("done");

    const list = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const listBody = list.body as { data: unknown[] };
    expect(listBody.data).toHaveLength(1);

    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });
});
